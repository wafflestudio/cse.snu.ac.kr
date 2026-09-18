import MainGraphic from '@/components/ui/MainGraphic';

export function GraphicDemo() {
  return (
    <div className="max-w-[960px] grid min-h-75 grid-cols-1 place-items-center bg-white py-10 max-sm:min-h-57.5 max-sm:py-8 [&>svg]:h-auto [&>svg]:w-[min(100%,416px)]">
      <MainGraphic />
    </div>
  );
}
