import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';

export function FoldedPanelDemo() {
  return (
    <div className="grid max-w-[560px] grid-cols-2 gap-8 max-sm:gap-6">
      {(
        [
          ['small', '작은 접힘 · 20px'],
          ['large', '큰 접힘 · 40px'],
        ] as const
      ).map(([size, label]) => (
        <figure key={size} className="min-w-0">
          <figcaption className="mb-4 min-h-10 text-xs/[1.7] text-neutral-600">
            {label}
          </figcaption>
          <div aria-hidden="true">
            <CornerFoldedRectangle
              colorTheme="black"
              size={size}
              shadow="light"
              width="w-full"
            >
              <div className="h-28" />
            </CornerFoldedRectangle>
          </div>
        </figure>
      ))}
    </div>
  );
}
