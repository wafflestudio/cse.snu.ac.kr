# serverFns

`createServerFn`으로 만든 **서버 전용 경계**. 단순 유틸(`src/utils/`)과 다르게 취급한다 —
컴파일러가 handler 본문을 클라 번들에서 잘라내고 그 자리에 RPC 스텁을 남기므로,
이 폴더의 파일은 "여기서부터 서버"라는 선을 긋는다.

규칙:
- 이 폴더의 export는 전부 `createServerFn` 결과다.
- 무거운 서버 전용 deps(cheerio·sharp 등)는 **handler 안 dynamic import로만** 참조한다.
  top-level로 빼면 스트립 대상에서 벗어나 **조용히 클라 번들이 오염된다**(타입 에러 없음).
- SSR에선 in-process 직접 호출, 클라 네비게이션에서만 RPC 왕복이다.

URL을 갖는 서버 리소스(`/img`·`/sitemap.xml`)는 file-based 라우팅 규칙상 `src/routes/`에 둔다.
