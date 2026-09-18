import { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';

export function MenuDemo() {
  const [selected, setSelected] = useState(0);
  const contents = ['최신순', '오래된순', '제목순'];
  return (
    <fieldset className="leading-[1.2] max-w-[560px] flex flex-col items-start [&>legend]:mb-4 [&>legend]:text-sm/[inherit] [&>legend]:font-medium">
      <legend>정렬 기준</legend>
      <Dropdown
        contents={contents}
        selectedIndex={selected}
        onClick={setSelected}
      />
    </fieldset>
  );
}
