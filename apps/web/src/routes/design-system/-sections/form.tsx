import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import Button from '@/components/ui/Button';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';
import LegacyAction from '../-legacy/Action';
import LegacyFieldset from '../-legacy/Fieldset';
import LegacyText from '../-legacy/Text';

// 입력·폼 페이지. 실제 form/ 부품을 그린다. 칸의 높이·테두리·오류 색은 부품이 정하므로 적지 않는다.

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
      title: '',
      phone: '',
      fax: '',
      year: 2024,
      yearWide: '2024',
      yearShort: '2024',
      sm: '',
      md: '',
      lg: '',
      full: '',
      note: '',
      files: [],
      tags: ['학부'],
      radio: 'ko',
      date: SAMPLE_DAY,
    },
  });
  return (
    <FormProvider {...methods}>
      <div className="w-full">{children}</div>
    </FormProvider>
  );
}

// 오류 예시: 처음부터 오류 상태로 보여 준다.
function InvalidSample() {
  const methods = useForm({ defaultValues: { title: '' } });
  const { setError } = methods;
  useEffect(() => {
    setError('title', { message: '제목을 입력해 주세요.' });
  }, [setError]);
  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-xl">
        <Fieldset title="제목" required>
          <Form.Text name="title" />
        </Fieldset>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="type-meta text-red-600">확인할 항목이 1개 있습니다.</p>
          <Button variant="secondary">취소</Button>
          <Button variant="primary">저장</Button>
        </div>
      </div>
    </FormProvider>
  );
}

// Do · Don't 견본: 처음부터 제목 오류가 난 폼. Do 는 실제 form/ 부품, Don't 는 예전 부품 사본(-legacy).
function useTitleError(message: string) {
  const methods = useForm({ defaultValues: { title: '', author: '' } });
  const { setError } = methods;
  useEffect(() => {
    setError('title', { message });
  }, [setError, message]);
  return methods;
}

function ErrorDo() {
  const methods = useTitleError('제목을 입력해 주세요.');
  return (
    <FormProvider {...methods}>
      <div className="w-full">
        <Fieldset title="제목" required>
          <Form.Text name="title" />
        </Fieldset>
        <Fieldset title="작성자">
          <Form.Text name="author" />
        </Fieldset>
        <Form.Action onCancel={() => {}} onSubmit={async () => {}} />
      </div>
    </FormProvider>
  );
}

function ErrorDont() {
  const methods = useTitleError('제목을 입력해주세요.');
  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col">
        <LegacyFieldset title="제목" required>
          <LegacyText name="title" />
        </LegacyFieldset>
        <LegacyFieldset title="작성자">
          <LegacyText name="author" />
        </LegacyFieldset>
        <LegacyAction />
      </div>
    </FormProvider>
  );
}

const YEARS = [2024, 2023, 2022].map((x) => ({ label: String(x), value: x }));

const WIDTHS = [
  ['sm', '짧게', '숫자·연도·호수'],
  ['md', '보통', '이름·전화·이메일·짧은 항목'],
  ['lg', '길게', '주소·웹사이트·한 줄 설명'],
  ['full', '꽉(기본)', '제목'],
] as const;

export function FormSection() {
  return (
    <>
      <Lead>입력 칸은 저장할 값을 넣거나 고르는 자리입니다.</Lead>

      <DocSection title="예시">
        <Example>
          <SampleForm>
            <Fieldset title="제목" required>
              <Form.Text name="title" placeholder="제목" />
            </Fieldset>
            <Form.Row>
              <Fieldset title="전화">
                <Form.Text name="phone" />
              </Fieldset>
              <Fieldset title="팩스">
                <Form.Text name="fax" />
              </Fieldset>
            </Form.Row>
            <div className="flex flex-wrap gap-x-6">
              <Fieldset title="연도" grow={false}>
                <Form.Dropdown name="year" contents={YEARS} />
              </Fieldset>
              <Fieldset title="날짜" grow={false}>
                <Form.Date name="date" />
              </Fieldset>
            </div>
            <div className="flex flex-wrap gap-x-6">
              <Fieldset title="분류" grow={false}>
                <div className="flex gap-4">
                  <Form.Checkbox name="tags" value="학부" />
                  <Form.Checkbox name="tags" value="대학원" />
                </div>
              </Fieldset>
              <Fieldset title="언어" grow={false}>
                <div className="flex gap-4">
                  <Form.Radio name="radio" value="ko" label="한국어" />
                  <Form.Radio name="radio" value="en" label="영어" />
                </div>
              </Fieldset>
            </div>
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="종류">
        <SampleForm>
          <VariantTable
            rows={[
              {
                name: '글자',
                sample: (
                  <div className="w-40">
                    <Form.Text name="md" placeholder="이름" />
                  </div>
                ),
                use: '한 줄 값. 폭은 아래 네 단계에서 고릅니다.',
              },
              {
                name: '긴 글',
                sample: (
                  <div className="w-40">
                    <Form.TextArea name="note" rows={2} />
                  </div>
                ),
                use: '여러 줄의 짧은 설명. 서식 있는 본문은 에디터.',
              },
              {
                name: '드롭다운',
                sample: <Form.Dropdown name="year" contents={YEARS} />,
                use: '정해진 항목 중 하나(연도·연구실처럼 항목이 많을 때).',
              },
              {
                name: '날짜·시간',
                sample: <Form.Date name="date" hideTime />,
                use: '날짜, 필요하면 시간까지.',
              },
              {
                name: '체크박스',
                sample: <Form.Checkbox name="tags" value="학부" />,
                use: '여러 항목 고르기(분류·태그).',
              },
              {
                name: '라디오',
                sample: <Form.Radio name="radio" value="ko" label="한국어" />,
                use: '폼 안의 몇 개뿐인 항목 중 하나(언어·교수 구분). 모두 보여 비교하기 쉽습니다.',
              },
              {
                name: '첨부',
                sample: <Form.File name="files" />,
                use: '파일·사진 첨부.',
              },
            ]}
          />
        </SampleForm>
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '보기를 바꿀 때(목록 거르기·정렬, 예약 날짜 넘기기)는 알약이나 버튼을 씁니다. 저장할 값이 아니기 때문입니다.',
            '검색어는 검색 칸, 서식 있는 본문은 에디터를 씁니다. 각각 실행 버튼과 서식이 함께 있어야 합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="폭">
        <Example caption="글자 칸 폭은 값의 길이에 맞춰 골라 얼마나 적을지 알립니다. 좁은 화면에서는 어떤 폭도 영역을 넘지 않습니다.">
          <SampleForm>
            <div className="space-y-4">
              {WIDTHS.map(([size, name, use]) => (
                <div
                  key={size}
                  className="grid items-center gap-2 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
                >
                  <div>
                    <p className="type-label">{name}</p>
                    <p className="type-meta text-neutral-500">{use}</p>
                  </div>
                  <Form.Text name={size} size={size} placeholder={name} />
                </div>
              ))}
            </div>
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="배치">
        <Example caption="짝을 이루는 값(전화·팩스)만 한 줄에 둘까지 둡니다. 짧은 값은 보통 폭까지, 긴 값은 줄을 반씩 나누고, 모바일에서는 세로로 쌓입니다.">
          <SampleForm>
            <Form.Row>
              <Fieldset title="전화">
                <Form.Text name="phone" />
              </Fieldset>
              <Fieldset title="팩스">
                <Form.Text name="fax" />
              </Fieldset>
            </Form.Row>
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="오류">
        <Example caption="오류 문장은 필드 바로 아래에, 버튼 줄 옆에는 개수만 둡니다. 긴 폼에서 위쪽 오류를 놓치지 않게 합니다.">
          <InvalidSample />
        </Example>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <ErrorDo />,
            caption: '고칠 곳 바로 아래에 오류 문장이 있습니다.',
          }}
          bad={{
            example: <ErrorDont />,
            caption:
              '예전 폼은 오류를 버튼 줄 옆에만 모아, 긴 폼에서 고칠 칸을 찾아야 했습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
