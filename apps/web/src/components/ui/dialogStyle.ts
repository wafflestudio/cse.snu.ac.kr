// 대화상자 판 한 벌(/design-system/dialog) — Dialog·AlertDialog·ImageModal 이 함께 쓴다.

// 뒤 가림막: 검정 50% + 흐림 2px.
export const OVERLAY_CLASS =
  'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

// 판: 흰 바탕·위 주황 3px·그림자, 모바일은 화면 폭 - 좌우 16, 높이 최대 90%(넘치면 판 안에서 스크롤).
// -top-[48%] 두 개는 오기가 아니라 들어오고(slide-in)·나가는(slide-out) 애니메이션이다.
export const PANEL_CLASS =
  'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-auto border-t-3 border-main-orange bg-white p-6 shadow-overlay duration-200 sm:p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]';

// 크기 셋: 확인 400 · 폼 560 · 넓게 768.
export const PANEL_SIZE = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-3xl',
} as const;
