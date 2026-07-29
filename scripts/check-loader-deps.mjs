#!/usr/bin/env node
/**
 * 게이트: 검색 파라미터를 읽는 loader는 반드시 loaderDeps를 선언해야 한다.
 *
 * TanStack Router의 match id에 loaderDeps 해시가 들어가므로, 선언이 없으면 검색
 * 파라미터만 바뀌는 클라 네비게이션에서 loader가 다시 돌지 않는다(= URL만 바뀌고
 * 화면은 그대로). 사람이 매번 기억할 게 아니라 게이트가 잡는다.
 * 배경: app/utils/loaderDeps.ts
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES_DIR = 'app/routes';

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const offenders = walk(ROUTES_DIR)
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .filter((f) => {
    const src = readFileSync(f, 'utf8');
    // import 식별자가 아니라 실제 선언(`loaderDeps:`)이 있는지를 본다.
    if (/\n\s*loaderDeps\s*:/.test(src)) return false;
    // beforeLoad는 매 네비게이션마다 실행돼 이 문제와 무관(__root의 로케일 판정) →
    // `loader:` 뒤에서 읽는 경우만 본다.
    const loaderIdx = src.search(/\n\s*loader:/);
    if (loaderIdx === -1) return false;
    return src.indexOf('location.searchStr', loaderIdx) !== -1;
  });

if (offenders.length > 0) {
  console.error(
    '검색 파라미터를 읽는 loader에 loaderDeps가 없습니다 ' +
      '(검색 파라미터만 바뀌는 네비게이션에서 loader가 재실행되지 않습니다):',
  );
  for (const f of offenders) console.error(`  - ${f}`);
  console.error(
    '\n고치는 법: `loaderDeps: searchLoaderDeps,`를 추가하세요 (@/utils/loaderDeps).',
  );
  process.exit(1);
}
