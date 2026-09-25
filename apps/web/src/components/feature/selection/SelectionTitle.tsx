import Node from '@/components/ui/Nodes';

interface SelectionTitleProps {
  title: string;
  subtitle?: string;
  animateKey?: string;
}

export default function SelectionTitle({
  title,
  subtitle,
  animateKey,
}: SelectionTitleProps) {
  return (
    <div className="mb-4 sm:w-fit" key={animateKey ?? title}>
      <h4 className="px-3 type-section text-neutral-950">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {subtitle && (
            <span className="pt-1 type-meta tracking-[0.02rem]">
              {subtitle}
            </span>
          )}
        </div>
      </h4>
      <div className="animate-stretch">
        <Node variant="straight" />
      </div>
    </div>
  );
}
