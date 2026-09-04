// Barrel export for local sonner copy
import { apiErrorMessage } from '@/utils/apiErrors';
import { toast } from './sonner/index.js';

export { Toaster, toast } from './sonner/index.js';

/**
 * 실패 토스트. 문구는 apiErrorMessage 가 정한다(백엔드 코드 사전 → 실패 종류별 문구).
 * API 실패를 알릴 땐 `toast.error` 대신 이걸 쓴다.
 */
export function toastError(error: unknown) {
  toast.error(apiErrorMessage(error));
}
