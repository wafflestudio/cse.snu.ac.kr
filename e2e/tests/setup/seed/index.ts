import { seedClubs, seedFacilities, seedFutureCareers } from './about';
import { seedAcademics } from './academics';
import { mockLoginCookie } from './client';
import { seedCommunity } from './community';
import { seedInternal } from './internal';
import { seedPeople } from './people';
import { seedResearch } from './research';

/**
 * 전체 baseline 시드 조합.
 *
 * 도메인별 시더(seed/<domain>.ts)를 의존 순서대로 호출합니다. STAFF 세션은 한 번만
 * 얻어 공유합니다. 새 도메인을 추가하면 여기에 한 줄 등록하세요.
 *
 * cross-domain 참조가 필요하면(예: 메인 슬라이드가 news를 참조) 앞 시더가 생성한
 * id를 반환받아 뒤 시더에 넘기는 식으로 이 파일에서 명시적으로 조합합니다.
 */
export async function seedBaseline() {
  const cookie = await mockLoginCookie('ROLE_STAFF');

  await seedResearch(cookie);
  await seedClubs(cookie);
  await seedFacilities(cookie);
  await seedFutureCareers(cookie);
  await seedCommunity(cookie);
  await seedPeople(cookie);
  await seedAcademics(cookie);
  await seedInternal(cookie);
  // ...
}
