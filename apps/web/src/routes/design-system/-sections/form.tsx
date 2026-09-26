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
  Related,
  RuleList,
  VariantTable,
} from '../-components/doc';

// 입력·폼 페이지. 실제 form/ 부품을 그린다 — 칸의 높이·테두리·오류 색은 부품이 정하므로 적지 않는다.

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
      <Lead>
        입력 칸은 값을 적거나 고르는 곳이다. 칸의 모양은 부품이 정하고, 쓰는
        사람은 칸의 종류와 폭, 필드를 한 줄에 둘지만 정한다. 보이는 입력 부품은{' '}
        <code>ui/</code>에 한 벌이고 <code>form/</code>은 그것을 폼 값에 잇기만
        한다.
      </Lead>

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
                use: '한 줄 값. 폭은 아래 네 단계에서 고른다.',
              },
              {
                name: '긴 글',
                sample: (
                  <div className="w-40">
                    <Form.TextArea name="note" rows={2} />
                  </div>
                ),
                use: '여러 줄의 짧은 설명. 서식이 있는 본문은 에디터.',
              },
              {
                name: '드롭다운',
                sample: <Form.Dropdown name="year" contents={YEARS} />,
                use: '정해진 항목 중 하나. 칸 폭은 가장 긴 항목에 맞춰지니 따로 정하지 않는다.',
              },
              {
                name: '날짜·시간',
                sample: <Form.Date name="date" hideTime />,
                use: '날짜, 필요하면 시간까지.',
              },
              {
                name: '체크박스',
                sample: <Form.Checkbox name="tags" value="학부" />,
                use: '여러 개를 켜고 끈다(분류·태그 고르기).',
              },
              {
                name: '라디오',
                sample: <Form.Radio name="radio" value="ko" label="한국어" />,
                use: '폼 안에서 값 하나를 고른다.',
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

      <DocSection title="폭">
        <Example caption="글자 칸의 폭은 들어갈 내용의 길이로 고른다. 좁은 화면에서는 모두 영역 폭을 넘지 않는다.">
          <SampleForm>
            <div className="space-y-4">
              {WIDTHS.map(([size, name, use]) => (
                <div
                  key={size}
                  className="grid items-center gap-2 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
                >
                  <div>
                    <p className="type-label">
                      {name} <span className="type-meta">{size}</span>
                    </p>
                    <p className="type-meta text-neutral-500">{use}</p>
                  </div>
                  <Form.Text name={size} size={size} placeholder={name} />
                </div>
              ))}
            </div>
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="입력 칸 대신 쓰는 것">
        <RuleList
          items={[
            '목록을 거르거나 정렬한다 → 알약(선택·태그).',
            '검색어를 받는다 → 검색 칸(검색 입력).',
            '서식이 있는 본문을 쓴다 → 에디터.',
            '예약 화면 툴바에서 날짜를 옮긴다 → 보조 버튼. 값을 입력하는 칸이 아니다.',
          ]}
        />
      </DocSection>

      <DocSection title="배치">
        <Example caption="필드 둘을 한 줄에 놓을 때만 Form.Row를 쓴다. 전화·팩스처럼 짧은 값은 기본(두 칸 모두 보통 폭까지), 긴 값은 full(반씩). 모바일에서는 세로로 쌓인다.">
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
        <RuleList
          items={[
            '필드는 Fieldset으로 감싸 이름을 달고, 꼭 적어야 하면 필수로 표시한다.',
            '줄 전체 폭을 고정하지 않는다 — 모바일에서 넘친다.',
            '폼 버튼 줄은 Form.Action으로 둔다(버튼 순서는 버튼 페이지).',
          ]}
        />
      </DocSection>

      <DocSection title="오류">
        <Example caption="오류 문장은 그 필드 바로 아래에 부품이 그린다. 버튼 줄 옆에는 개수만 적는다 — 긴 폼에서 위쪽 오류를 놓치지 않게. 문장은 문구 페이지를 따른다.">
          <InvalidSample />
        </Example>
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <SampleForm>
                <Fieldset title="연도">
                  <Form.Text name="yearShort" size="sm" />
                </Fieldset>
              </SampleForm>
            ),
            caption: '짧은 값에는 짧은 칸.',
          }}
          bad={{
            example: (
              <SampleForm>
                <Fieldset title="연도">
                  <Form.Text name="yearWide" />
                </Fieldset>
              </SampleForm>
            ),
            caption: '기본 폭(꽉)을 그대로 둔다 — 빈 칸이 길게 늘어진다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['button', '버튼'],
            ['selection', '선택·태그'],
            ['search', '검색 입력'],
            ['editor', '에디터'],
            ['writing', '문구'],
          ]}
        />
      </DocSection>
    </>
  );
}
