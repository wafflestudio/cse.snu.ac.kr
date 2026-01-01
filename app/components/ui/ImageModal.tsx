import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useEffect, useState } from 'react';
import { useLanguage } from '~/hooks/useLanguage';

// Material Icons 체크박스 SVG
const CheckboxUnchecked = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className={className}
  >
    <mask
      id="mask0_10305_21737"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="20"
      height="20"
    >
      <rect width="20" height="20" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_10305_21737)">
      <path d="M4.42443 17.0827C4.00345 17.0827 3.64714 16.9368 3.35547 16.6452C3.0638 16.3535 2.91797 15.9972 2.91797 15.5762V4.42247C2.91797 4.0015 3.0638 3.64518 3.35547 3.35352C3.64714 3.06185 4.00345 2.91602 4.42443 2.91602H15.5782C15.9992 2.91602 16.3555 3.06185 16.6471 3.35352C16.9388 3.64518 17.0846 4.0015 17.0846 4.42247V15.5762C17.0846 15.9972 16.9388 16.3535 16.6471 16.6452C16.3555 16.9368 15.9992 17.0827 15.5782 17.0827H4.42443ZM4.42443 15.8327H15.5782C15.6423 15.8327 15.7011 15.8059 15.7544 15.7525C15.8079 15.6991 15.8346 15.6404 15.8346 15.5762V4.42247C15.8346 4.35831 15.8079 4.29956 15.7544 4.24622C15.7011 4.19275 15.6423 4.16602 15.5782 4.16602H4.42443C4.36026 4.16602 4.30151 4.19275 4.24818 4.24622C4.19471 4.29956 4.16797 4.35831 4.16797 4.42247V15.5762C4.16797 15.6404 4.19471 15.6991 4.24818 15.7525C4.30151 15.8059 4.36026 15.8327 4.42443 15.8327Z" />
    </g>
  </svg>
);

const CheckboxChecked = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className={className}
  >
    <mask
      id="mask0_10305_21810"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="20"
      height="20"
    >
      <rect width="20" height="20" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_10305_21810)">
      <path d="M8.83464 11.4546L6.8988 9.51852C6.78339 9.40324 6.63832 9.34421 6.46359 9.34143C6.28901 9.33879 6.1413 9.39782 6.02047 9.51852C5.89977 9.63935 5.83943 9.78574 5.83943 9.95768C5.83943 10.1296 5.89977 10.276 6.02047 10.3968L8.30734 12.6837C8.45804 12.8343 8.6338 12.9096 8.83464 12.9096C9.03547 12.9096 9.21123 12.8343 9.36193 12.6837L13.9982 8.04747C14.1135 7.93206 14.1725 7.78699 14.1753 7.61227C14.1779 7.43768 14.1189 7.28997 13.9982 7.16914C13.8773 7.04845 13.731 6.9881 13.559 6.9881C13.3871 6.9881 13.2407 7.04845 13.1198 7.16914L8.83464 11.4546ZM4.42443 17.0827C4.00345 17.0827 3.64714 16.9368 3.35547 16.6452C3.0638 16.3535 2.91797 15.9972 2.91797 15.5762V4.42247C2.91797 4.0015 3.0638 3.64518 3.35547 3.35352C3.64714 3.06185 4.00345 2.91602 4.42443 2.91602H15.5782C15.9992 2.91602 16.3555 3.06185 16.6471 3.35352C16.9388 3.64518 17.0846 4.0015 17.0846 4.42247V15.5762C17.0846 15.9972 16.9388 16.3535 16.6471 16.6452C16.3555 16.9368 15.9992 17.0827 15.5782 17.0827H4.42443ZM4.42443 15.8327H15.5782C15.6423 15.8327 15.7011 15.8059 15.7544 15.7525C15.8079 15.6991 15.8346 15.6404 15.8346 15.5762V4.42247C15.8346 4.35831 15.8079 4.29956 15.7544 4.24622C15.7011 4.19275 15.6423 4.16602 15.5782 4.16602H4.42443C4.36026 4.16602 4.30151 4.19275 4.24818 4.24622C4.19471 4.29956 4.16797 4.35831 4.16797 4.42247V15.5762C4.16797 15.6404 4.19471 15.6991 4.24818 15.7525C4.30151 15.8059 4.36026 15.8327 4.42443 15.8327Z" />
    </g>
  </svg>
);

interface ImageModalProps {
  /** 이미지 URL */
  imageSrc: string;
  /** 이미지 alt 텍스트 */
  imageAlt?: string;
  /** 모달 제목 (접근성용) */
  title?: string;
  /** 액션 버튼 클릭 핸들러 */
  onAction?: () => void;
}

const STORAGE_KEY = 'happy-new-year-but-no-more-modal';

export default function ImageModal({
  imageSrc,
  imageAlt = '',
  title = '이벤트 안내',
  onAction,
}: ImageModalProps) {
  const { t } = useLanguage({
    닫기: 'Close',
    '참여 신청하기': 'Apply Now',
    '다시 보지 않기': "Don't show again",
  });
  const [open, setOpen] = useState(false);
  const [hideModal, setHideModal] = useState(false);

  // localStorage에서 "다시 보지 않기" 상태 확인
  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!hidden) {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // 닫을 때 "다시 보지 않기"가 체크되어 있으면 localStorage에 저장
    if (!newOpen && hideModal) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const handleAction = () => {
    onAction?.();
    setOpen(false);
    if (hideModal) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          </VisuallyHidden.Root>

          {/* 세로 레이아웃 */}
          <div className="flex flex-col w-[90vw] max-w-[320px] max-h-[70vh] sm:max-w-[400px] sm:max-h-[90vh] rounded-[4px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)] overflow-hidden bg-white">
            {/* 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* 버튼 영역 */}
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-400 active:bg-neutral-200 active:text-neutral-500 text-[15px] font-medium leading-[22px] tracking-[0.025em] focus:outline-none transition-colors"
              >
                {t('닫기')}
              </button>
              <button
                type="button"
                onClick={handleAction}
                className="flex-1 px-6 py-3 bg-main-orange text-white hover:bg-[#ff7b34] hover:text-white active:bg-[#f55a00] active:text-[#ffc38f] text-[15px] font-medium leading-[22px] tracking-[0.025em] focus:outline-none transition-colors"
              >
                {t('참여 신청하기')}
              </button>
            </div>
          </div>

          {/* 다시 보지 않기 체크박스 */}
          <label className="group absolute -bottom-8 left-0 flex items-center gap-1 cursor-pointer">
            {hideModal ? (
              <CheckboxChecked className="fill-white group-hover:fill-neutral-400 group-active:fill-main-orange transition-colors" />
            ) : (
              <CheckboxUnchecked className="fill-white group-hover:fill-neutral-400 group-active:fill-main-orange transition-colors" />
            )}
            <span className="text-[14px] font-medium leading-5 text-white group-hover:text-neutral-400 group-active:text-main-orange transition-colors">
              {t('다시 보지 않기')}
            </span>
            <input
              type="checkbox"
              checked={hideModal}
              onChange={(e) => setHideModal(e.target.checked)}
              className="appearance-none"
            />
          </label>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
