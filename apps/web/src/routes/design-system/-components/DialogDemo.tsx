import { SquareArrowOutUpRight, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div className="leading-[1.2] max-w-120">
      <div className="mb-3 flex justify-end">
        <button
          ref={trigger}
          type="button"
          className="grid size-9 place-items-center text-neutral-600 hover:bg-neutral-100"
          aria-label={'다이얼로그 열기'}
          title={'다이얼로그 열기'}
          onClick={() => setOpen(true)}
        >
          <SquareArrowOutUpRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="relative border-t-3 border-b border-main-orange bg-neutral-50 p-6">
        <X
          size={24}
          className="absolute top-4 right-4 text-neutral-500"
          aria-hidden="true"
        />
        <DialogContents />
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={'자료 이용 안내'}
        closeLabel={'닫기'}
        contentClassName="sm:w-[480px] [&_:where(a,button):focus-visible]:outline-2 [&_:where(a,button):focus-visible]:outline-link [&_:where(a,button):focus-visible]:outline-offset-4"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus();
        }}
      >
        <DialogContents onDone={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}

function DialogContents({ onDone }: { onDone?: () => void }) {
  return (
    <div className="pt-8">
      <h4 className="mb-3.5 text-xl/[1.4] font-bold">{'자료 이용 안내'}</h4>
      <p className="mb-6 text-md/[1.85] text-neutral-600">
        {
          '학부에서 제공하는 자료는 게시된 날짜를 기준으로 작성되었습니다. 최신 일정과 변경 사항은 해당 공지를 확인해 주세요.'
        }
      </p>
      <div inert={!onDone}>
        <Button variant="neutral" onClick={onDone}>
          {'확인'}
        </Button>
      </div>
    </div>
  );
}
