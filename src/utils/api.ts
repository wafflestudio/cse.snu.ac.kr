import { notFound } from '@tanstack/react-router';
import ky, { HTTPError } from 'ky';
import { BASE_URL } from '@/constants/api';
import { forwardAuthHeaders } from './ssr';

/**
 * 백엔드 API 클라이언트 단일 출처. 비-2xx는 HTTPError로 throw(ky 기본).
 * - 본문을 읽는 호출만 `.json<T>()`를 부른다 — 빈 본문 엔드포인트(DELETE 등)에
 *   `.json()`을 부르면 throw되는 게 의도된 동작(경계에서 정직하게).
 * - timeout·retry는 기존 fetch 동작 보존을 위해 해제.
 */
export const api = ky.create({
  prefix: BASE_URL, // 절대 URL — SSR에서도 동작. 입력의 앞 슬래시는 경계에서 정규화됨.
  timeout: false,
  retry: 0,
  hooks: {
    beforeError: [
      ({ error }) => {
        // 백엔드 404는 라우트 notFound로 전역 변환 — 상세 loader가 개별 처리할 필요 없음.
        // (SSR 404 상태코드·notFoundComponent·클라 네비 모두 프레임워크 정식 경로를 탄다.)
        if (error instanceof HTTPError && error.response.status === 404) {
          throw notFound();
        }
        return error;
      },
    ],
    beforeRequest: [
      ({ request }) => {
        // SSR loader의 세션 쿠키를 백엔드로 전역 포워딩(클라는 빈 객체라 no-op).
        // 라우트별로 잊는 버그 계열(2026-08-30 news·seminar 유령 동작)을 구조적으로 차단.
        for (const [key, value] of Object.entries(forwardAuthHeaders())) {
          request.headers.set(key, value);
        }
      },
    ],
  },
});
