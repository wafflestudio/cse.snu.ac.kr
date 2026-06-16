/**
 * 시드 공용 유틸. 도메인별 시드 모듈(seed/<domain>.ts)이 공유합니다.
 */
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';

/** STAFF(또는 지정 역할) 세션 쿠키(JSESSIONID)를 발급받습니다. */
export async function mockLoginCookie(...roles: string[]): Promise<string> {
  const selected = roles.length > 0 ? roles : ['ROLE_STAFF'];
  const params = selected.map((r) => `role=${r}`).join('&');
  const res = await fetch(`${BACKEND_URL}/api/v2/mock-login?${params}`);
  if (!res.ok) throw new Error(`mock-login 실패: ${res.status}`);
  const setCookie = res.headers.getSetCookie?.().join('; ') ?? '';
  const jsessionid = setCookie.match(/JSESSIONID=[^;]+/)?.[0];
  if (!jsessionid) throw new Error('JSESSIONID 쿠키를 받지 못했습니다');
  return jsessionid;
}

/**
 * multipart/form-data 전송(JSON은 `request` 파트). 이 앱의 생성/수정 컨벤션.
 * 기본 POST(생성). PUT 업서트 싱글톤(예: recruit)은 method='PUT'로 호출.
 */
export async function postMultipart<T>(
  cookie: string,
  path: string,
  request: unknown,
  method: 'POST' | 'PUT' = 'POST',
): Promise<T> {
  const form = new FormData();
  form.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  );
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { cookie },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${await res.text()}`);
  }
  // 일부 생성 엔드포인트는 빈 본문(또는 비-JSON)을 반환한다(예: student-clubs).
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * application/json 전송. multipart가 아닌 `@RequestBody` 엔드포인트용(예: future-careers
 * stat/company, notice enrollTag, conference PATCH). 기본 POST, method로 PATCH/PUT 지정.
 */
export async function postJson<T>(
  cookie: string,
  path: string,
  body: unknown,
  method: 'POST' | 'PATCH' | 'PUT' = 'POST',
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${await res.text()}`);
  }
  // 일부 엔드포인트는 평문 문자열을 반환한다(예: notice enrollTag "등록되었습니다.").
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
