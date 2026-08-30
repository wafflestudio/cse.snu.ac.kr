import { notFound } from '@tanstack/react-router';
import ky, { HTTPError } from 'ky';
import { BASE_URL } from '@/constants/api';
import { forwardAuthHeaders } from './ssr';

/** 백엔드 API 클라이언트 단일 출처. 비-2xx는 HTTPError로 throw. */
export const api = ky.create({
  prefix: BASE_URL, // 절대 URL — SSR에서도 동작. 입력의 앞 슬래시는 경계에서 정규화됨.
  hooks: {
    beforeError: [
      ({ error }) => {
        if (error instanceof HTTPError && error.response.status === 404) {
          throw notFound();
        }
        return error;
      },
    ],
    beforeRequest: [
      ({ request }) => {
        // SSR loader의 세션 쿠키를 백엔드로 전역 포워딩(클라는 빈 객체라 no-op)
        for (const [key, value] of Object.entries(forwardAuthHeaders())) {
          request.headers.set(key, value);
        }
      },
    ],
  },
});
