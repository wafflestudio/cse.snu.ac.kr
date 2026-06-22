import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders, setCookie } from '@tanstack/react-start/server';
import type { Locale } from '@/types/i18n';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// nginx ISR 캐시 디렉터리(컨테이너-로컬). nginx.conf의 proxy_cache_path와 일치.
const NGINX_CACHE_DIR = '/var/cache/nginx/app';

/**
 * nginx ISR 캐시를 섹션 단위로 무효화한다(staff 콘텐츠 수정 직후 `fetchOk`가 호출 → 익명 즉시 반영).
 * - `scope`가 섹션 경로(예: `/community/notice`)면 캐시파일 KEY(=URI)에 그 섹션을 포함하는
 *   항목(ko/en·상세·목록·`?pageNum=` 전부) + 메인(`/ko`,`/en`)만 삭제. 나머지 캐시는 유지.
 * - `scope`가 `*`(admin 일괄작업, 영향 범위 넓음)이면 전체 flush.
 * - nginx 없으면(로컬·E2E, BEHIND_NGINX 미설정) 또는 비로그인이면 no-op(익명 abuse 방지).
 * - nginx는 파일 부재를 MISS로 처리. node:fs는 핸들러 내 동적 import → 클라 번들 제외.
 */
export const purgeCache = createServerFn({ method: 'POST' })
  .validator((data: { scope: string }) => data)
  .handler(async ({ data }): Promise<{ purged: number }> => {
    if (process.env.BEHIND_NGINX !== '1') return { purged: 0 };
    if (!(getRequestHeaders().get('cookie') ?? '').includes('JSESSIONID=')) {
      return { purged: 0 };
    }
    const { promises: fs } = await import('node:fs');
    const { join } = await import('node:path');

    // levels=1:2 → 캐시 파일은 2뎁스 하위. 전체 파일 경로 수집.
    const files: string[] = [];
    const walk = async (dir: string): Promise<void> => {
      const ents = await fs
        .readdir(dir, { withFileTypes: true })
        .catch(() => []);
      for (const e of ents) {
        const p = join(dir, e.name);
        if (e.isDirectory()) await walk(p);
        else files.push(p);
      }
    };
    await walk(NGINX_CACHE_DIR);

    const flushAll = data.scope === '*';
    const isHome = (key: string) =>
      /^\/(ko|en)(\?|$)/.test(key) && key.replace(/\?.*/, '').length <= 3;

    let purged = 0;
    await Promise.all(
      files.map(async (f) => {
        if (!flushAll) {
          // 캐시파일 헤더의 `KEY: <uri>` 읽기(바이너리 헤더 직후, 앞 2KB 안).
          const fh = await fs.open(f, 'r').catch(() => null);
          if (!fh) return;
          const buf = Buffer.alloc(2048);
          await fh.read(buf, 0, 2048, 0).catch(() => {});
          await fh.close();
          const key =
            buf.toString('latin1').match(/\nKEY: ([^\n]*)/)?.[1] ?? '';
          if (!key.includes(data.scope) && !isHome(key)) return;
        }
        await fs.rm(f, { force: true }).catch(() => {});
        purged += 1;
      }),
    );
    return { purged };
  });

/**
 * 언어 설정 쿠키를 서버에서 설정한다(RR `/lang` action 대체).
 * 클라이언트(언어 토글)에서 호출 → 쿠키 set 후 호출부가 localized 경로로 네비게이트.
 */
export const setLangCookie = createServerFn({ method: 'POST' })
  .validator((lang: Locale) => lang)
  .handler(({ data }) => {
    setCookie('lang', data, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return { ok: true };
  });
