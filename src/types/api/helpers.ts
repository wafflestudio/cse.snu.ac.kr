import type { paths } from './generated';

// 백엔드 OpenAPI 스펙(`pnpm gen:api`)에서 응답 타입을 꺼내는 헬퍼.
//
// 경로+메서드로 주소를 잡는다. 두 가지 이유:
// ① `{total, searchList}` 같은 공용 래퍼는 스키마 이름만으론 어느 도메인 것인지 구분되지 않는다.
// ② operationId는 불안정하다 — springdoc이 컨트롤러 메서드명에서 뽑으면서 중복이면
//    `searchTop`·`searchTop_1`·`searchTop_2`처럼 번호를 붙인다. 컨트롤러가 하나 늘면
//    번호가 밀려 타입이 말없이 다른 엔드포인트에 붙는다. 경로는 그런 일이 없다.
//
// ⚠️ 요청 바디에는 쓰지 않는다. 응답의 optional은 "값이 null"이지만 요청의 optional은
// "생략 가능"이라 의미가 다르다. 요청은 `components['schemas'][...]`를 그대로 쓴다.

// 스펙의 `?`를 떼고 `| null`만 남긴다.
//
// 왜: springdoc은 Kotlin `T?`를 required에서 빼고 `type: [T, "null"]`로 적는다(2.8.17+).
// 그래서 생성 타입이 `T | null | undefined`가 되는데, 백엔드 Jackson은
// default-property-inclusion이 ALWAYS(기본값)라 **응답에 선언된 키가 항상 들어간다**.
// 즉 undefined는 실제로 오지 않는다 — 떼는 게 사실에 맞다.
// ⚠️ 백엔드가 `non_null` 직렬화로 바꾸면 이 전제가 깨진다. 그때는 이 매핑을 지운다.
type AllKeysPresent<T> = T extends (infer U)[]
  ? AllKeysPresent<U>[]
  : T extends object
    ? { [K in keyof T]-?: AllKeysPresent<T[K]> }
    : T;

type Ok<T> = T extends { responses: { 200: { content: { '*/*': infer B } } } }
  ? AllKeysPresent<B>
  : never;

/** 엔드포인트의 200 응답 본문 타입. 메서드 기본값은 GET. */
export type Res<P extends keyof paths, M extends keyof paths[P] = 'get'> = Ok<
  paths[P][M]
>;
