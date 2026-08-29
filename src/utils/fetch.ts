/**
 * HTTP 상태 코드가 200대가 아니면 에러를 throw하는 fetch wrapper
 */
export async function fetchOk(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const url = input instanceof Request ? input.url : String(input);
    throw new Error(
      `HTTP Error: ${response.status} ${response.statusText} (URL: ${url})`,
    );
  }

  return response;
}

/**
 * fetch를 실행하고 자동으로 JSON 파싱하는 함수
 * 200대가 아니면 에러를 throw
 */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchOk(input, init);
  // DELETE 등 일부 엔드포인트는 200이지만 본문이 비어 있습니다. 빈 본문을
  // response.json()으로 파싱하면 throw되므로(삭제 성공인데 실패로 처리되는 버그),
  // 본문이 없으면 undefined를 반환합니다.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
