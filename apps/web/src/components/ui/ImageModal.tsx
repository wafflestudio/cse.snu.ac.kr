import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Square, SquareCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { OVERLAY_CLASS } from './dialogStyle';

interface ImageModalProps {
  /** localStorage 키 구분용 식별자 */
  id: string | number;
  /** 이미지 URL */
  imageSrc: string;
  /** 외부 링크 - 있으면 액션 버튼 노출, 클릭 시 새 창으로 이동 */
  externalLink?: string | null;
}

const STORAGE_KEY_PREFIX = 'image-modal-hidden-';

export default function ImageModal({
  id,
  imageSrc,
  externalLink,
}: ImageModalProps) {
  const { t } = useLanguage({
    닫기: 'Close',
    '자세히 보기': 'Learn More',
    '다시 보지 않기': "Don't show again",
    '이벤트 안내': 'Event Notice',
  });
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
  const [open, setOpen] = useState(false);
  const [hideModal, setHideModal] = useState(false);

  // localStorage에서 "다시 보지 않기" 상태 확인
  useEffect(() => {
    const hidden = localStorage.getItem(storageKey) === 'true';
    if (!hidden) {
      setOpen(true);
    }
  }, [storageKey]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // 닫을 때 "다시 보지 않기"가 체크되어 있으면 localStorage에 저장
    if (!newOpen && hideModal) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  const handleAction = () => {
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
    }
    setOpen(false);
    if (hideModal) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={OVERLAY_CLASS} />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>{t('이벤트 안내')}</DialogPrimitive.Title>
          </VisuallyHidden.Root>

          {/* 세로 레이아웃 */}
          <div className="flex flex-col w-[90vw] max-w-[320px] max-h-[70vh] sm:max-w-[400px] sm:max-h-[90vh] shadow-overlay overflow-hidden bg-white">
            {/* 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <img
                src={imageSrc}
                alt=""
                className="w-full h-auto object-contain"
              />
            </div>
            {/* 버튼 영역 */}
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="flex-1 h-11.5 px-6 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300 type-label transition-colors focus:outline-none"
              >
                {t('닫기')}
              </button>
              {externalLink && (
                <button
                  type="button"
                  onClick={handleAction}
                  // 주요 버튼 색 — 포스터 색이 매번 달라 어떤 이미지와도 어울리는 회색(/design-system/dialog).
                  className="flex-1 h-11.5 px-6 bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-500 type-label transition-colors focus:outline-none"
                >
                  {t('자세히 보기')}
                </button>
              )}
            </div>
          </div>

          {/* 다시 보지 않기 체크박스 */}
          {/* 판 밖 가림막 위 흰 글자 — 어두운 면 글자 버튼 규칙(호버 주황·누름 짙은 주황). */}
          <label className="absolute -bottom-8 left-0 flex cursor-pointer items-center gap-1 type-label text-white transition-colors hover:text-main-orange active:text-main-orange-dark">
            {hideModal ? <SquareCheck /> : <Square />}
            {t('다시 보지 않기')}
            <input
              type="checkbox"
              checked={hideModal}
              onChange={(e) => setHideModal(e.target.checked)}
              className="sr-only"
            />
          </label>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
