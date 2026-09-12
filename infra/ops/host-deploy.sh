#!/usr/bin/env bash
# 호스트에서 빌드하고 배포한다. deploy.yml 이 레포 클론을 배포할 커밋으로 맞춘 뒤
# 레포 루트에서 이 스크립트를 실행한다. 백엔드(apps/api)·웹(apps/web) 이미지를 만들어 infra 의 compose 스택으로 올린다.
# 필요 env: GIT_SHA · TARGET · KAKAO. 나머지 설정은 infra/<TARGET>.env 를 스스로 읽는다.
set -euo pipefail

: "${GIT_SHA:?GIT_SHA 가 필요하다}"
: "${TARGET:?TARGET(production|staging) 이 필요하다}"
# 웹 빌드의 카카오맵 키(git 밖). deploy.yml 이 시크릿에서 넘긴다.
: "${KAKAO:?KAKAO 가 필요하다}"

# 비밀이 아닌 배포 설정은 전부 레포의 infra/<TARGET>.env 에 있다 — 호스트·프로파일·URL·웹 빌드 mode·Caddyfile·인증서 경로.
set -a; . "infra/$TARGET.env"; set +a
: "${PROFILE:?}" "${URL:?}" "${CADDYFILE:?}" "${WEB_MODE:?}"

WORKSPACE=$PWD
API_DIR=$WORKSPACE/apps/api
INFRA=$WORKSPACE/infra
APP_DIR=$HOME/app
PROXY_DIR=$HOME/proxy
GRADLE_VOLUME=csereal-gradle
TAG=${GIT_SHA:0:12}
SECRETS_FILE=$HOME/secrets/app.env

say() { echo "▸ $*"; }

build_jar() {
    say "gradle bootJar"
    docker run --rm -v "$GRADLE_VOLUME:/root/.gradle" -v "$API_DIR:/src" -w /src \
        eclipse-temurin:21-jdk ./gradlew --no-daemon bootJar -x test
}

build_images() {
    say "api 이미지: csereal-api:$TAG"
    docker build -q --build-arg JAR_STAGE=prebuilt --build-arg GIT_SHA="$GIT_SHA" \
        -t "csereal-api:$TAG" "$API_DIR"

    # 컨텍스트는 레포 루트(워크스페이스 lockfile). .dockerignore 가 apps/api·e2e·infra 를 뺀다.
    say "web 이미지: csereal-web:$TAG"
    docker build -q -f "$WORKSPACE/apps/web/Dockerfile" \
        --build-arg BUILD_MODE="$WEB_MODE" --build-arg VITE_KAKAO_MAP_API_KEY="$KAKAO" --build-arg GIT_SHA="$GIT_SHA" \
        -t "csereal-web:$TAG" "$WORKSPACE"

    # nori 는 공식 이미지에 없는 플러그인이라 검색 서버도 우리가 만든다. 
    # 해시를 확인해 Dockerfile.es 가 그대로면 다시 만들지 않는다.
    SEARCH_TAG=$(git ls-tree HEAD -- infra/Dockerfile.es | sha256sum | cut -c1-12)
    if docker image inspect "csereal-search:$SEARCH_TAG" >/dev/null 2>&1; then
        say "검색 이미지 그대로: $SEARCH_TAG"
    else
        say "검색 이미지: $SEARCH_TAG"
        docker build -q -f "$INFRA/Dockerfile.es" -t "csereal-search:$SEARCH_TAG" "$INFRA"
    fi
}

# 호스트의 비밀 + 레포의 설정 + 이번 빌드의 태그를 합쳐 compose 가 읽을 .env 를 만든다.
write_env() {
    local dir=$1; shift
    [ -f "$SECRETS_FILE" ] || {
        echo "✗ $SECRETS_FILE 이 없다. README 의 '호스트 .env' 를 보고 만들 것." >&2
        exit 1
    }
    for key in MYSQL_ROOT_PASSWORD MYSQL_USER MYSQL_PASSWORD MYSQL_DATABASE; do
        grep -q "^$key=" "$SECRETS_FILE" || { echo "✗ $SECRETS_FILE 에 $key 가 없다" >&2; exit 1; }
    done
    {
        echo "# host-deploy.sh 가 매 배포마다 다시 만든다. 여기서 고치지 말 것."
        echo "# 비밀은 secrets.env 에 있다."
        for kv in "$@"; do echo "$kv"; done
    } >"$dir/.env"
}

deploy_app() {
    # compose 프로젝트 디렉터리는 ~/app 이다(프로젝트 이름과 상대 볼륨 경로가 거기 묶여 있다).
    cp "$INFRA/compose.yml" "$INFRA/compose.prod.yml" "$APP_DIR/"
    cd "$APP_DIR"
    write_env "$APP_DIR" "PROFILE=$PROFILE" "URL=$URL" "IMAGE_TAG=$TAG" "SEARCH_TAG=$SEARCH_TAG"
    cat "$SECRETS_FILE" >>.env

    mkdir -p "$HOME/frontend-data/img-optimized" "$HOME/frontend-data/analytics"
    # 웹이 compose 스택에 들어오기 전에 단독으로 돌던 컨테이너. 포트 3000 을 비워야 한다. 남아 있는 호스트가 없어지면 지울 것.
    docker rm -f frontend >/dev/null 2>&1 || true

    say "compose up"
    # --wait 은 healthcheck 가 healthy 가 될 때까지 기다린다. 없으면 앱이 크래시 루프여도 배포가 초록불로 끝난다.
    docker compose -f compose.yml -f compose.prod.yml up -d --wait --remove-orphans

    # 의도한 커밋이 실제로 떴는지 본다.
    # 이미지가 잘못 태깅됐거나 compose 가 옛 태그를 잡았다면 여기서 걸린다.
    local name running
    for name in csereal_api csereal_web; do
        running=$(docker inspect "$name" --format '{{range .Config.Env}}{{println .}}{{end}}' |
            sed -n 's/^GIT_SHA=//p')
        [ "$running" = "$GIT_SHA" ] ||
            { echo "✗ $name 의 커밋이 다르다: 기대 $GIT_SHA / 실제 ${running:-없음}" >&2; exit 1; }
    done
}

deploy_edge() {
    # 앱 다음에 온다 — 여기서 실패해도 앱은 이미 서비스 중이다.
    # reload 는 무중단이고 설정이 틀리면 적용하지 않으므로 매 배포마다 돌려도 된다.
    cp "$INFRA/compose.caddy.yml" "$PROXY_DIR/"
    mkdir -p "$PROXY_DIR/caddy"
    cp "$INFRA/$CADDYFILE" "$PROXY_DIR/caddy/Caddyfile"
    cd "$PROXY_DIR"
    # 인증서 경로는 비밀이 아니라 infra/production.env 에 있다. staging 은 아예 없다.
    {
        echo "URL=$URL"
        [ -n "${CERTIFICATE:-}" ] && echo "CERTIFICATE=$CERTIFICATE"
        [ -n "${PRIVATE_KEY:-}" ] && echo "PRIVATE_KEY=$PRIVATE_KEY"
    } >.env || true

    say "caddy 반영"
    docker compose -f compose.caddy.yml up -d --remove-orphans
    for _ in $(seq 1 15); do docker exec csereal_caddy caddy version >/dev/null 2>&1 && break; sleep 2; done
    docker exec csereal_caddy caddy validate --config /etc/caddy/Caddyfile
    docker exec csereal_caddy caddy reload --config /etc/caddy/Caddyfile
}

# 이미지가 커밋마다 쌓인다. 최근 5개는 남겨 IMAGE_TAG 로 롤백할 수 있게.
prune_old_images() {
    local repo
    for repo in csereal-api csereal-web; do
        docker images "$repo" --format '{{.Tag}}' | tail -n +6 |
            xargs -r -I{} docker rmi "$repo:{}" >/dev/null 2>&1 || true
    done
}

build_jar
build_images
deploy_app
deploy_edge
prune_old_images
say "배포 완료 — $TAG"
