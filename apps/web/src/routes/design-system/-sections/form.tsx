import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import Button from '@/components/ui/Button';
import Calendar from '@/components/ui/Calendar';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 달력은 이번 달을 펼치므로 예시 날짜도 이번 달 15일로.
const SAMPLE_DAY = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  15,
  10,
  0,
);

function SampleForm({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: {
      text: '',
      sm: '',
      md: '',
      lg: '',
      full: '',
      year: 2024,
      tags: ['학부'],
      radio: 'ko',
      date: SAMPLE_DAY,
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

// 오류 예시: 처음부터 오류 상태로 보여 준다.
function InvalidSample() {
  const methods = useForm({ defaultValues: { title: '' } });
  const { setError } = methods;
  useEffect(() => {
    setError('title', { message: '제목을 입력해주세요.' });
  }, [setError]);
  return (
    <FormProvider {...methods}>
      <Fieldset title="제목" required>
        <Form.Text name="title" />
      </Fieldset>
    </FormProvider>
  );
}

const WIDTHS = [
  ['sm', '짧게', '80px', '숫자·연도·호수'],
  ['md', '보통', '320px', '이름·전화·이메일·짧은 항목'],
  ['lg', '길게', '480px', '주소·웹사이트·한 줄 설명'],
  ['full', '꽉(기본)', '영역 전체', '제목'],
] as const;

export function FormSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="한 벌">
        <p>
          보이는 입력 부품은 <code>ui/</code>에 한 벌만 둔다(체크박스·라디오·
          드롭다운). <code>form/</code>은 그 부품을 react-hook-form에 잇는 일만
          한다. 입력 칸의 모양 값은 <code>ui/field.ts</code> 한 곳이다.
        </p>
      </Sub>

      <Sub title="입력 칸 — 높이·테두리·바탕 하나">
        <SampleForm>
          <div className="flex flex-wrap items-start gap-3">
            <div className="w-40">
              <Form.Text name="text" placeholder="입력" />
            </div>
            <Form.Dropdown
              name="year"
              contents={[2024, 2023, 2022].map((x) => ({
                label: String(x),
                value: x,
              }))}
            />
            <Form.Date name="date" />
            <Button variant="secondary">추가</Button>
          </div>
        </SampleForm>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            글자·드롭다운·날짜·시간 칸은 모두 34px — 보통 버튼과 같아 한 줄에
            놓으면 위아래가 맞는다.
          </li>
          <li>
            테두리 neutral-300, 바탕 흰색, 안쪽 여백 12px, 자리표시 글자
            neutral-300. 초점은 테두리 없이 캐럿만.
          </li>
          <li>
            부품에 높이·테두리·바탕을 덮어쓰는 통로는 없다. 폭만 아래 네
            단계에서 고른다.
          </li>
        </ul>
      </Sub>

      <Sub title="폭 — 네 단계">
        <SampleForm>
          <div className="max-w-3xl space-y-3">
            {WIDTHS.map(([size, name, px, use]) => (
              <div
                key={size}
                className="grid items-center gap-2 sm:grid-cols-[160px_1fr] sm:gap-6"
              >
                <div>
                  <p className="type-label">
                    {name} <code className="type-meta">size="{size}"</code>
                  </p>
                  <p className="type-meta text-neutral-500">
                    {px} · {use}
                  </p>
                </div>
                <Form.Text name={size} size={size} placeholder={name} />
              </div>
            ))}
          </div>
        </SampleForm>
        <p>
          글자 입력 폭은 들어갈 내용의 길이로 고른다. 좁은 화면에서는 모두 영역
          폭을 넘지 않는다.
        </p>
      </Sub>

      <Sub title="체크박스·라디오">
        <SampleForm>
          <div className="space-y-3">
            <div className="flex gap-4">
              <Form.Checkbox name="tags" value="학부" />
              <Form.Checkbox name="tags" value="대학원" />
            </div>
            <div className="flex gap-4">
              <Form.Radio name="radio" value="ko" label="한국어" />
              <Form.Radio name="radio" value="en" label="영어" />
            </div>
          </div>
        </SampleForm>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            켜짐은 neutral-700(주요 버튼 면과 같은 색), 꺼짐은 neutral-500,
            호버하면 꺼진 아이콘이 neutral-600. 체크박스는 위치가 아니라 입력
            값이라 "선택은 주황"(내비·탭)이 아니라 "행동은 회색"을 따른다.
          </li>
          <li>
            체크박스는 네모+체크(<code>SquareCheck</code>). 라디오는 테두리 원(
            <code>Circle</code>)에, 켜지면 가운데 원 지름 절반의 채운 점을
            얹는다(shadcn/ui·Material과 같은 비율). lucide{' '}
            <code>CircleDot</code>은 점이 원의 10%라 쓰지 않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="드롭다운">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            목록은 칸 아래 4px에 떠 있는 층이다(그림자 overlay, 모서리 2px).
            항목 높이 34, 호버 neutral-100, 고른 항목 주황.
          </li>
          <li>
            칸 폭은 가장 긴 항목에 맞춘다 — 고르는 값이 바뀌어도 칸이 줄었다
            늘지 않는다. 폭을 따로 정하지 않는다.
          </li>
          <li>방향키·Home/End·타입어헤드·Esc로 고를 수 있다.</li>
        </ul>
      </Sub>

      <Sub title="오류 — 필드 바로 아래">
        <div className="max-w-xl">
          <InvalidSample />
          <div className="flex items-center justify-end gap-3">
            <p className="type-meta text-red-600">
              확인할 항목이 1개 있습니다.
            </p>
            <Button variant="secondary">취소</Button>
            <Button variant="primary">저장하기</Button>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            오류는 그 필드 테두리를 red-600으로 바꾸고 바로 아래 8px에 13px
            red-600 문장으로 쓴다. 부품이 자기 <code>name</code>의 오류를 직접
            읽어 그리므로 화면 코드가 따로 할 일은 없다.
          </li>
          <li>
            폼 버튼 줄 옆에는 개수만 적는다. 긴 폼에서 저장을 눌렀을 때 위쪽
            오류를 놓치지 않게 하기 위해서다.
          </li>
          <li>
            폼 버튼 줄(<code>Form.Action</code>)은 마지막 필드와 48
            떨어진다(묶음 사이). 필드 사이 24와 같으면 버튼 줄이 필드 하나처럼
            붙어 보인다.
          </li>
        </ul>
      </Sub>

      <Sub title="첨부 — 파일·이미지">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            파일·이미지 고르기는 보조 버튼(<code>Button secondary</code>)이다.
          </li>
          <li>
            파일 목록은 최대 480px, 행 34px, 구분선 실선. 긴 파일명은 한 줄
            말줄임.
          </li>
          <li>
            지우기는 파일·이미지 모두 같은 X 텍스트 버튼(20px, 호버 주황).
          </li>
        </ul>
      </Sub>

      <Sub title="날짜·시간">
        <div className="w-fit">
          <Calendar selected={SAMPLE_DAY} onSelect={() => {}} />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>날짜 칸과 시간 칸은 다른 입력 칸과 같은 모양이다.</li>
          <li>
            달력 글자는 글자 단계를 따른다: 월 이름 14/500, 요일 13, 날짜 14,
            고른 날짜는 짙은 주황 굵게.
          </li>
          <li>
            예약 화면 툴바의 날짜 버튼은 값을 입력하는 칸이 아니라 날짜를 옮기는
            버튼이라 보조 버튼이다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
