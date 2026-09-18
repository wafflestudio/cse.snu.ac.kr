import Node from '@/components/ui/Nodes';

export function ConnectionsDemo() {
  const samples = [
    ['straight', '직선 · 한쪽 노드'],
    ['straightDouble', '직선 · 양쪽 노드'],
    ['curvedHorizontalSmall', '사선'],
    ['curvedHorizontalGray', '꺾인 선 · 가로'],
    ['curvedVertical', '꺾인 선 · 세로'],
  ] as const;
  return (
    <div className="grid max-w-[560px] grid-cols-2 gap-x-8 gap-y-6 max-sm:gap-x-6">
      {samples.map(([variant, label]) => (
        <figure key={variant}>
          <figcaption className="min-h-10 text-xs/[1.7] text-neutral-600">
            {label}
          </figcaption>
          <div
            aria-hidden="true"
            className={`flex h-32 [&_.border-neutral-600]:border-main-orange ${variant === 'curvedVertical' ? 'items-start pb-5' : 'items-center'} ${variant === 'curvedHorizontalSmall' || variant === 'curvedHorizontalGray' ? '[&_.rotate-45]:w-18' : ''}`}
          >
            <Node variant={variant} />
          </div>
        </figure>
      ))}
    </div>
  );
}
