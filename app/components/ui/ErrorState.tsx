import type { ReactNode } from 'react';
import Button from './Button';

interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface ErrorStateProps {
  title: string;
  message: ReactNode;
  action: ErrorAction;
}

export default function ErrorState({
  title,
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex grow flex-col items-center justify-center bg-neutral-900 px-6 py-24 sm:py-32">
      <div className="text-center">
        <div className="mb-8">
          <div className="mb-6 text-[120px] font-bold leading-none text-main-orange sm:text-[160px]">
            {title}
          </div>
          <p className="text-xl text-white sm:text-2xl">{message}</p>
        </div>
        <Button variant="solid" tone="brand" size="lg" onClick={action.onClick}>
          {action.label}
        </Button>
      </div>
    </div>
  );
}
