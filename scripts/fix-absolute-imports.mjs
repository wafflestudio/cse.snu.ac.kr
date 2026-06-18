// 이동된 도메인에 대한 절대 import(@/routes/<domain>) 재작성.
// 도메인 디렉터리를 {-$locale}/ 아래로 옮기면 상대 import는 보존되지만 절대 import는 깨진다.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const domains = [
  'search', 'about', 'community', 'people', 'research',
  'admissions', 'academics', 'reservations', '10-10-project',
];
const files = execSync(
  `grep -rlE "@/routes/(main|${domains.join('|')})/" app`,
  { encoding: 'utf8' },
).split('\n').filter(Boolean);

let n = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.replaceAll('@/routes/main/', '@/routes/{-$locale}/'); // main/* → {-$locale}/ 루트
  for (const d of domains) {
    s = s.replaceAll(`@/routes/${d}/`, `@/routes/{-$locale}/${d}/`);
  }
  if (s !== before) {
    fs.writeFileSync(f, s);
    n++;
  }
}
console.log(`절대 import 재작성: ${n} 파일`);
