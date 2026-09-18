import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Tag } from '@/components/ui/Tag';

export function TagDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="leading-[1.2] max-w-[560px] flex min-h-9 flex-wrap items-center gap-4">
      <Tag label="학부" />
      <Tag label="대학원" variant="solid" />
      {visible ? (
        <Tag label="CSE" onDelete={() => setVisible(false)} />
      ) : (
        <button
          type="button"
          className="grid size-9 place-items-center rounded-none text-neutral-600 hover:bg-neutral-200"
          title="태그 복원"
          aria-label="태그 복원"
          onClick={() => setVisible(true)}
        >
          <RotateCcw size={16} />
        </button>
      )}
    </div>
  );
}
