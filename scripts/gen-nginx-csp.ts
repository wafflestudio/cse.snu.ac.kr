// app/utils/csp.ts의 CSP 정책을 nginx add_header 형태로 출력(정책 단일 출처).
// 빌드 시: `tsx scripts/gen-nginx-csp.ts > nginx/csp.conf` → nginx.conf가 include.
// nonce는 nginx가 매 요청 $request_id로 채우므로 placeholder로 리터럴 '$request_id'를 박는다.
import { getCSPHeaders } from '../app/utils/csp';

const policy = getCSPHeaders('$request_id');
process.stdout.write(
  '# 자동 생성: scripts/gen-nginx-csp.ts (출처 app/utils/csp.ts). 직접 수정 금지.\n' +
    `add_header Content-Security-Policy "${policy}" always;\n`,
);
