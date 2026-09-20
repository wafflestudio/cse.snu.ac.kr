import { useEffect, useRef, useState } from 'react';

const TEXT =
  '서울대학교 컴퓨터공학부는 1975년 설립 이래 우리나라 컴퓨터 분야의 연구와 교육을 이끌어 왔습니다. 학부와 대학원 과정에서 프로그래밍 언어, 운영체제, 데이터베이스, 인공지능, 컴퓨터 구조 등 전 분야를 다루며, 졸업생들은 학계와 산업계 곳곳에서 일하고 있습니다.';

export function ReadingWidth() {
  const [width, setWidth] = useState(720);
  const text = useRef<HTMLParagraphElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(0);

  // 좁은 화면에서 720 으로 열면 글이 상자 밖으로 나가 처음부터 옆으로 밀어야 읽힌다.
  useEffect(() => {
    const available = box.current?.clientWidth;
    if (available) setWidth((w) => Math.min(w, available));
  }, []);

  // 줄 수는 재 봐야 안다 — 글자 폭이 한글·숫자·공백마다 다르다. 폭뿐 아니라 글꼴이
  // 늦게 실려도 줄이 바뀌므로 상자 크기를 관찰한다.
  useEffect(() => {
    const el = text.current;
    if (!el) return;
    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      setLines(range.getClientRects().length);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-[960px]">
      <label className="mb-2 block text-xs/[inherit] font-medium text-neutral-600">
        {'글 폭'}
        <input
          className="mt-2 block w-full max-w-100 accent-main-orange"
          type="range"
          min={280}
          max={1200}
          step={8}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div className="overflow-x-auto bg-neutral-50 p-5 max-sm:p-4">
        {/* 상자의 안쪽 폭을 재려고 한 겹 둔다 — 바깥은 패딩을 포함한다. */}
        <div ref={box} />
        <p
          ref={text}
          className="text-md/[1.75] text-neutral-800"
          style={{ width }}
        >
          {TEXT}
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-3 border-y border-neutral-200 py-5 [&_div+div]:border-l [&_div+div]:border-neutral-200 [&_div+div]:pl-5 [&_dt]:text-xs/[inherit] [&_dt]:text-neutral-500 [&_dd]:mt-1.5 [&_dd]:text-xl/[inherit] [&_dd]:font-medium">
        <div>
          <dt>{'폭'}</dt>
          <dd>{width}</dd>
        </div>
        <div>
          <dt>{'줄 수'}</dt>
          <dd>{lines || '–'}</dd>
        </div>
        <div>
          <dt>{'한 줄 글자'}</dt>
          <dd>{lines ? Math.round(TEXT.length / lines) : '–'}</dd>
        </div>
      </dl>
    </div>
  );
}
