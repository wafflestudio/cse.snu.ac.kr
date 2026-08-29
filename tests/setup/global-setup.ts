import { normalizeDates, resetDb, seedContent } from './db';
import { seedBaseline } from './seed';

/**
 * Playwright globalSetup: 매 런 시작 시 1회.
 * 로컬 docker DB를 비우고 결정론적 baseline을 심습니다(시드 id 매 런 동일 → read 안정).
 * 이후 read 프로젝트가 baseline 위에서 실행되고, flow가 mutation을 수행합니다
 * (playwright.config의 project dependencies로 순서 보장).
 */
export default async function globalSetup() {
  console.log('[e2e] DB 리셋 중…');
  await resetDb();

  // content 싱글톤(about 등)은 API 생성 경로가 없어 SQL로 직접 시드한다.
  console.log('[e2e] content 싱글톤 SQL 시드 중…');
  await seedContent();

  console.log('[e2e] API baseline 시드 생성 중…');
  await seedBaseline();

  // 게시물 created_at은 서버가 박으므로 비결정적 → 비주얼 결정론을 위해 고정값으로 정규화.
  console.log('[e2e] 게시물 날짜 정규화 중…');
  await normalizeDates();
  console.log('[e2e] 시드 완료');
}
