#!/usr/bin/env node
// 주요 공개 페이지(== read.spec.ts 비주얼 테스트 페이지)에 대한 Lighthouse 점수 측정.
//
// 측정 전용 도구다(성능 최적화는 사용자와 함께 — 여기선 점수만 뽑는다).
//
// 페이지 목록은 read.spec.ts의 `goto('/...')`에서 자동 추출 → 비주얼 테스트가 보는
// 페이지와 항상 일치(스펙이 늘면 자동 반영). 404·빈상태·내부 페이지만 denylist로 제외.
//
// 환경: 기본 타깃은 배포된 staging 서버(공개 접근, 프론트+백엔드 동일 오리진)다.
// 별도 로컬 서버·백엔드 docker가 필요 없고, 실제 배포 산출물(빌드·CDN·네트워크 포함)을
// 대표적으로 측정한다. 로컬 빌드를 재고 싶으면 LH_BASE_URL로 오버라이드한다.
// Lighthouse는 호스트 Chrome을 띄운다(perf 점수는 CPU 민감 → 네이티브가 컨테이너보다 안정·대표적).
// lighthouse는 `pnpm dlx`로 받는다(별도 devDep 없음). 버전 고정이 필요하면 devDep으로 추가.
//
// 사용:
//   pnpm lighthouse                 # staging의 추출된 전 페이지
//   pnpm lighthouse /about /research/labs   # 특정 경로만
//   LH_BASE_URL=http://localhost:3000 pnpm lighthouse   # 로컬 prod 프리뷰 측정(pnpm preview 선행)

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// staging = 배포된 프리-프로드(README 환경 표). 프론트·백엔드 동일 도메인.
const BASE_URL = process.env.LH_BASE_URL ?? 'https://168.107.16.249.nip.io';
const OUT_DIR = 'lighthouse-reports';
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

// read.spec.ts에서 goto하지만 "주요 공개 페이지"가 아닌 것(404·빈상태·내부).
const DENYLIST = [/this-path-does-not-exist/, /존재하지않는/, /^\/\.internal/];

/** read.spec.ts들의 literal goto('/...') 경로를 모아 정렬·중복 제거. */
function collectPagesFromSpecs() {
  const files = execFileSync('git', ['ls-files', 'tests/**/read.spec.ts'], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

  const paths = new Set();
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/goto\(\s*['"`](\/[^'"`]*)['"`]/g)) {
      paths.add(m[1]);
    }
  }
  return [...paths]
    .filter((p) => !p.includes('${')) // 템플릿 리터럴(동적 경로) 제외
    .filter((p) => !DENYLIST.some((re) => re.test(p)))
    .sort();
}

function slugify(path) {
  return path.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'root';
}

/** :3000이 떠 있는지 확인. 없으면 안내 후 종료. */
async function assertServerUp() {
  try {
    await fetch(BASE_URL, { method: 'HEAD' });
  } catch {
    console.error(
      `\n✗ ${BASE_URL} 에 연결할 수 없습니다.\n` +
        '  기본 타깃은 배포된 staging 서버입니다 — 네트워크/배포 상태를 확인하세요.\n' +
        '  로컬을 측정하려면: pnpm preview 후 LH_BASE_URL=http://localhost:3000 pnpm lighthouse\n',
    );
    process.exit(1);
  }
}

function runLighthouse(path) {
  const url = `${BASE_URL}${path}`;
  const slug = slugify(path);
  const outBase = `${OUT_DIR}/${slug}`;
  const res = spawnSync(
    'pnpm',
    [
      'dlx',
      'lighthouse',
      url,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
      `--only-categories=${CATEGORIES.join(',')}`,
      '--output=json',
      '--output=html',
      `--output-path=${outBase}`,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
  );
  if (res.status !== 0) return null;
  try {
    const report = JSON.parse(readFileSync(`${outBase}.report.json`, 'utf8'));
    const scores = {};
    for (const c of CATEGORIES) {
      const s = report.categories[c]?.score;
      scores[c] = s == null ? null : Math.round(s * 100);
    }
    return { path, slug, scores, htmlReport: `${outBase}.report.html` };
  } catch {
    return null;
  }
}

function pct(n) {
  return n == null ? ' — ' : String(n).padStart(3);
}

async function main() {
  const argPaths = process.argv.slice(2);
  const pages = argPaths.length ? argPaths : collectPagesFromSpecs();
  if (!pages.length) {
    console.error('측정할 페이지가 없습니다.');
    process.exit(1);
  }

  await assertServerUp();
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\nLighthouse — ${BASE_URL} (${pages.length}개 페이지)\n`);
  const header = 'Perf  A11y  BP   SEO   Page';
  console.log(header);
  console.log('-'.repeat(header.length + 20));

  const results = [];
  for (const path of pages) {
    const r = runLighthouse(path);
    if (!r) {
      console.log(`  ✗ 실패: ${path}`);
      continue;
    }
    const s = r.scores;
    console.log(
      `${pct(s.performance)}   ${pct(s.accessibility)}   ${pct(s['best-practices'])}  ${pct(s.seo)}   ${path}`,
    );
    results.push(r);
  }

  writeFileSync(
    `${OUT_DIR}/summary.json`,
    JSON.stringify(
      { baseUrl: BASE_URL, ranAt: new Date().toISOString(), results },
      null,
      2,
    ),
  );
  console.log(`\n리포트: ${OUT_DIR}/ (페이지별 HTML + summary.json)\n`);
}

main();
