import type { ReactNode } from 'react';
import { Fragment } from 'react';
import Button from '@/components/ui/Button';
import { WEIGHT_SCALE } from '../-tokens';

/** 색상 절의 해부도와 같은 짜임 — 규칙을 적고, 역할을 세우고, 그 아래 진짜 화면을 둔다. */
function Diagram({
  roles,
  children,
}: {
  roles: [string, string][];
  children: ReactNode;
}) {
  return (
    <figure>
      <dl className="mb-4 grid max-w-[560px] grid-cols-[auto_minmax(0,1fr)] gap-x-4">
        {roles.map(([token, role]) => (
          <Fragment key={token}>
            <dt className="py-0.5 [&_code]:text-neutral-500">
              <code>{token}</code>
            </dt>
            <dd className="py-0.5 text-sm/[1.6] text-neutral-600">{role}</dd>
          </Fragment>
        ))}
      </dl>
      <div className="max-w-[560px] border border-neutral-200">{children}</div>
    </figure>
  );
}

/** 해부도 안에서 그 자리의 토큰 이름. 내용이 아니라 주석이라 흐리게 둔다. */
function Pin({ name }: { name: string }) {
  return (
    <code className="ml-2 align-middle text-xs/[inherit] text-neutral-400">
      {name}
    </code>
  );
}

export function WeightExamples() {
  return (
    <Diagram roles={WEIGHT_SCALE.map((w) => [String(w.value), w.role])}>
      <div className="p-5">
        <h4 className="text-base font-bold text-neutral-900">
          {'학부 전산망 인증서 갱신 안내'}
          <Pin name="700" />
        </h4>
        <p className="mt-2 text-md/[1.35] text-neutral-800">
          {'9월 30일까지 갱신하지 않으면 접속이 제한됩니다.'}
          <Pin name="400" />
        </p>
        <ul className="mt-4 border-t border-neutral-200">
          {['등록금 수납계획 알림', '사물함 신청 안내'].map((title) => (
            <li
              key={title}
              className="flex items-center justify-between border-b border-neutral-200 py-2.5"
            >
              <span className="text-md font-medium text-neutral-800">
                {title}
                <Pin name="500" />
              </span>
              <span className="text-sm text-neutral-500">{'2034/9/12'}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button variant="primary" size="md">
            {'신청하기'}
          </Button>
          <Pin name="500" />
        </div>
      </div>
    </Diagram>
  );
}
