import {
  Bookmark,
  Calendar,
  MapPin,
  Paperclip,
  Pause,
  Pin,
  Play,
  Search,
  User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ICON_SCALE } from '../-tokens';

const SAMPLE: Record<number, string> = {
  12: '더 보기',
  16: '301동 551-4호',
  24: '국가 AI 컴퓨팅센터',
};

export function IconSizes() {
  return (
    <div className="max-w-[960px] border border-neutral-200">
      <div className="grid grid-cols-[72px_64px_minmax(0,1fr)] items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[11px] text-neutral-500 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4 max-sm:[&>span:last-child]:hidden">
        <span>{'토큰'}</span>
        <span>{'크기'}</span>
        <span>{'쓰는 곳'}</span>
      </div>
      {ICON_SCALE.map((token) => (
        <div
          className="grid grid-cols-[72px_64px_minmax(0,1fr)] items-baseline gap-3 px-5 py-4 [&~div]:border-t [&~div]:border-neutral-100 [&>span]:text-xs/[inherit] [&>span]:text-neutral-600 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4"
          key={token.name}
        >
          <span className="text-neutral-500">
            <code>{token.name}</code>
          </span>
          <span className="tabular-nums">{token.px}px</span>
          <span className="max-sm:col-span-full">{token.role}</span>
          <p
            className={`col-span-full mt-2 flex items-center gap-1.5 text-neutral-900 ${token.textClassName}`}
          >
            <MapPin className={`${token.className} text-neutral-500`} />
            {SAMPLE[token.px]}
          </p>
        </div>
      ))}
    </div>
  );
}

/** 선이 기본이고 채움은 넷뿐이라, 같은 상자에 나란히 놓아 그 차이만 보인다. */
export function IconFill() {
  return (
    <figure className="max-w-[560px] border border-neutral-200">
      <Row label="선" hint="글 옆에 서는 아이콘 전부">
        <Paperclip className="size-4 text-neutral-400" />
        <Search className="size-4 text-neutral-400" />
        <User className="size-4 text-neutral-400" />
        <Calendar className="size-4 text-neutral-400" />
      </Row>
      <Row label="채움" hint="원래 실루엣이던 넷">
        <Pin className="size-4 text-main-orange" fill="currentColor" />
        <Bookmark className="size-4 text-main-orange" fill="currentColor" />
        <Play className="size-4 text-neutral-400" fill="currentColor" />
        <Pause className="size-4 text-neutral-400" fill="currentColor" />
      </Row>
    </figure>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 [&~div]:border-t [&~div]:border-neutral-100">
      <span className="w-11 shrink-0 text-xs/[inherit] text-neutral-500">
        {label}
      </span>
      <span className="flex shrink-0 items-center gap-3">{children}</span>
      <span className="text-xs/[1.6] text-neutral-600">{hint}</span>
    </div>
  );
}
