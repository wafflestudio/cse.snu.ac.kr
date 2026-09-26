// Barrel export for local sonner copy
import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { createElement } from 'react';
import { apiErrorMessage } from '@/utils/apiErrors';
import { toast } from './sonner/index.js';

export { Toaster, toast } from './sonner/index.js';

/**
 * 토스트 아이콘은 lucide 한 벌(/design-system/toast). 상태는 아이콘이 알리고 판 색은 하나다.
 * `<Toaster icons={TOAST_ICONS} />`
 */
export const TOAST_ICONS = {
  success: createElement(CircleCheck, { className: 'text-neutral-950' }),
  error: createElement(CircleAlert, { className: 'text-red-600' }),
  info: createElement(Info, { className: 'text-neutral-600' }),
};

/**
 * 실패 토스트. 문구는 apiErrorMessage 가 정한다(백엔드 코드 사전 → 실패 종류별 문구).
 * API 실패를 알릴 땐 `toast.error` 대신 이걸 쓴다.
 */
export function toastError(error: unknown) {
  toast.error(apiErrorMessage(error));
}
