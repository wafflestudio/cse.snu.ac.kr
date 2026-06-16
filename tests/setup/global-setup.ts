import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedBaseline } from './seed';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Playwright globalSetup: 매 런 시작 시 1회.
 * 로컬 docker DB를 비우고 결정론적 baseline을 심습니다.
 * → 시드 id가 항상 동일 → read가 안정적.
 *
 * 이후 read 프로젝트가 baseline 위에서 실행되고, 그다음 flow 프로젝트가
 * mutation을 수행합니다(playwright.config의 project dependencies로 순서 보장).
 */
export default async function globalSetup() {
  console.log('[e2e] DB 리셋 중…');
  execFileSync('bash', [path.join(here, 'reset-db.sh')], { stdio: 'inherit' });

  // content 싱글톤(about 등)은 API 생성 경로가 없어 SQL로 직접 시드한다.
  console.log('[e2e] content 싱글톤 SQL 시드 중…');
  execFileSync('bash', [path.join(here, 'seed-content.sh')], {
    stdio: 'inherit',
  });

  console.log('[e2e] API baseline 시드 생성 중…');
  await seedBaseline();

  // 게시물 created_at은 서버가 박으므로 비결정적 → 비주얼 결정론을 위해 고정값으로 정규화.
  console.log('[e2e] 게시물 날짜 정규화 중…');
  execFileSync('bash', [path.join(here, 'normalize-dates.sh')], {
    stdio: 'inherit',
  });
  console.log('[e2e] 시드 완료');
}
