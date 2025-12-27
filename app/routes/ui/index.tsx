import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import AlertDialog from '~/components/ui/AlertDialog';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import Calendar from '~/components/ui/Calendar';
import Checkbox from '~/components/ui/Checkbox';
import CornerFoldedRectangle from '~/components/ui/CornerFoldedRectangle';
import Dialog from '~/components/ui/Dialog';
import Dropdown from '~/components/ui/Dropdown';
import ErrorState from '~/components/ui/ErrorState';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Image from '~/components/ui/Image';
import Node from '~/components/ui/Nodes';
import Pagination from '~/components/ui/Pagination';
import { Tag } from '~/components/ui/Tag';
import { COLOR_THEME } from '~/constants/color';
import type { Attachment } from '~/types/api/v2/attachment';

type SelectOption<T extends string> = { label: string; value: T };

type NodeVariant =
  | 'straight'
  | 'straightDouble'
  | 'curvedHorizontal'
  | 'curvedHorizontalGray'
  | 'curvedHorizontalSmall'
  | 'curvedVertical';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'text' | 'pill';
type ButtonTone = 'brand' | 'neutral' | 'inverse' | 'muted' | 'inherit';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type TagVariant = 'outline' | 'solid' | 'muted';
type TagSize = 'sm' | 'md';

type CornerTheme = keyof typeof COLOR_THEME;

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const BUTTON_VARIANTS: SelectOption<ButtonVariant>[] = [
  { label: 'solid', value: 'solid' },
  { label: 'outline', value: 'outline' },
  { label: 'ghost', value: 'ghost' },
  { label: 'text', value: 'text' },
  { label: 'pill', value: 'pill' },
];

const BUTTON_TONES: SelectOption<ButtonTone>[] = [
  { label: 'brand', value: 'brand' },
  { label: 'neutral', value: 'neutral' },
  { label: 'inverse', value: 'inverse' },
  { label: 'muted', value: 'muted' },
  { label: 'inherit', value: 'inherit' },
];

const BUTTON_SIZES: SelectOption<ButtonSize>[] = [
  { label: 'xs', value: 'xs' },
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
];

const TAG_VARIANTS: SelectOption<TagVariant>[] = [
  { label: 'outline', value: 'outline' },
  { label: 'solid', value: 'solid' },
  { label: 'muted', value: 'muted' },
];

const TAG_SIZES: SelectOption<TagSize>[] = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
];

const NODE_VARIANTS: SelectOption<NodeVariant>[] = [
  { label: 'straight', value: 'straight' },
  { label: 'straightDouble', value: 'straightDouble' },
  { label: 'curvedHorizontal', value: 'curvedHorizontal' },
  { label: 'curvedHorizontalGray', value: 'curvedHorizontalGray' },
  { label: 'curvedHorizontalSmall', value: 'curvedHorizontalSmall' },
  { label: 'curvedVertical', value: 'curvedVertical' },
];

const DEMO_IMAGE_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" rx="16" fill="#E5E7EB"/><path d="M40 140 L120 80 L180 120 L240 60 L300 140" stroke="#9CA3AF" stroke-width="8" fill="none"/><circle cx="86" cy="74" r="16" fill="#F97316"/></svg>',
  );

const DEMO_ATTACHMENTS: Attachment[] = [
  {
    id: 1,
    name: '데모-파일-1.pdf',
    url: '/files/demo-file-1.pdf',
    bytes: 23456,
  },
  {
    id: 2,
    name: '데모-파일-2.zip',
    url: '/files/demo-file-2.zip',
    bytes: 1048576,
  },
];

const DEMO_HTML =
  '<p><strong>HTMLViewer</strong> 데모 콘텐츠입니다. <a href="https://example.com">링크</a>를 확인하세요.</p><ul><li>첫 번째 항목</li><li>두 번째 항목</li></ul>';

const CORNER_THEMES: SelectOption<CornerTheme>[] = Object.keys(COLOR_THEME).map(
  (key) => ({ label: key, value: key as CornerTheme }),
);

function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: 여기서는 뭐...
    <label className="flex flex-wrap items-center gap-3 text-sm text-neutral-700">
      <span className="min-w-[120px] font-medium">{label}</span>
      {children}
    </label>
  );
}

function SelectControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
}) {
  return (
    <select
      className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function UiPlayground() {
  const [buttonLabel, setButtonLabel] = useState('기본 버튼');
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>('solid');
  const [buttonTone, setButtonTone] = useState<ButtonTone>('brand');
  const [buttonSize, setButtonSize] = useState<ButtonSize>('md');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(false);

  const [tagLabel, setTagLabel] = useState('태그');
  const [tagVariant, setTagVariant] = useState<TagVariant>('outline');
  const [tagSize, setTagSize] = useState<TagSize>('sm');
  const [tagDisabled, setTagDisabled] = useState(false);
  const [tagWithHref, setTagWithHref] = useState(false);
  const [tagWithDelete, setTagWithDelete] = useState(false);
  const [tagClicks, setTagClicks] = useState(0);

  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState('라벨');

  const [dropdownIndex, setDropdownIndex] = useState(0);
  const dropdownOptions = ['옵션 A', '옵션 B', '옵션 C'];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfirmCount, setAlertConfirmCount] = useState(0);

  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [paginationTotalPages, setPaginationTotalPages] = useState(12);
  const [searchParams] = useSearchParams();
  const pageNum = useMemo(() => {
    const value = Number(searchParams.get('pageNum') ?? 1);
    return Number.isNaN(value) ? 1 : value;
  }, [searchParams]);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarDisablePast, setCalendarDisablePast] = useState(false);

  const [imageWidth, setImageWidth] = useState(240);
  const [imageQuality, setImageQuality] = useState(80);

  const [htmlContent, setHtmlContent] = useState(DEMO_HTML);
  const [htmlShowImage, setHtmlShowImage] = useState(true);

  const [nodeVariant, setNodeVariant] = useState<NodeVariant>('straight');
  const [nodeTone, setNodeTone] = useState<'brand' | 'neutral'>('brand');
  const [nodeDirection, setNodeDirection] = useState<'row' | 'col'>('row');
  const [nodeGrow, setNodeGrow] = useState(false);

  const [cornerTheme, setCornerTheme] = useState<CornerTheme>('orange');
  const [cornerAnimation, setCornerAnimation] = useState(false);

  const [errorMessage, setErrorMessage] = useState('문제가 발생했습니다.');
  const [errorTitle, setErrorTitle] = useState('에러 상태');
  const [errorWithTitle, setErrorWithTitle] = useState(true);
  const [errorClicks, setErrorClicks] = useState(0);

  const [attachmentsVisible, setAttachmentsVisible] = useState(true);

  const htmlImage = htmlShowImage
    ? {
        src: DEMO_IMAGE_SRC,
        width: 240,
        height: 160,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-semibold text-neutral-900">
            UI 플레이그라운드
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            컴포넌트 prop을 바꿔가며 다양한 상태를 확인하세요.
          </p>
        </header>

        <PageSection title="버튼">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="라벨">
              <input
                className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={buttonLabel}
                onChange={(event) => setButtonLabel(event.target.value)}
              />
            </ControlRow>
            <ControlRow label="변형">
              <SelectControl
                value={buttonVariant}
                onChange={setButtonVariant}
                options={BUTTON_VARIANTS}
              />
            </ControlRow>
            <ControlRow label="톤">
              <SelectControl
                value={buttonTone}
                onChange={setButtonTone}
                options={BUTTON_TONES}
              />
            </ControlRow>
            <ControlRow label="크기">
              <SelectControl
                value={buttonSize}
                onChange={setButtonSize}
                options={BUTTON_SIZES}
              />
            </ControlRow>
            <ControlRow label="비활성화">
              <input
                type="checkbox"
                checked={buttonDisabled}
                onChange={(event) => setButtonDisabled(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="선택 상태 (pill)">
              <input
                type="checkbox"
                checked={buttonSelected}
                onChange={(event) => setButtonSelected(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="왼쪽 아이콘">
              <input
                type="checkbox"
                checked={buttonIcon}
                onChange={(event) => setButtonIcon(event.target.checked)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Button
              variant={buttonVariant}
              tone={buttonTone}
              size={buttonSize}
              selected={buttonVariant === 'pill' ? buttonSelected : undefined}
              disabled={buttonDisabled}
              iconLeft={
                buttonIcon ? (
                  <span className="material-symbols-rounded text-base">
                    bolt
                  </span>
                ) : undefined
              }
            >
              {buttonLabel}
            </Button>
          </div>
        </PageSection>

        <PageSection title="태그">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="라벨">
              <input
                className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={tagLabel}
                onChange={(event) => setTagLabel(event.target.value)}
              />
            </ControlRow>
            <ControlRow label="변형">
              <SelectControl
                value={tagVariant}
                onChange={setTagVariant}
                options={TAG_VARIANTS}
              />
            </ControlRow>
            <ControlRow label="크기">
              <SelectControl
                value={tagSize}
                onChange={setTagSize}
                options={TAG_SIZES}
              />
            </ControlRow>
            <ControlRow label="비활성화">
              <input
                type="checkbox"
                checked={tagDisabled}
                onChange={(event) => setTagDisabled(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="링크">
              <input
                type="checkbox"
                checked={tagWithHref}
                onChange={(event) => setTagWithHref(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="삭제 버튼">
              <input
                type="checkbox"
                checked={tagWithDelete}
                onChange={(event) => setTagWithDelete(event.target.checked)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Tag
              label={tagLabel}
              variant={tagVariant}
              size={tagSize}
              disabled={tagDisabled}
              href={tagWithHref ? '#tag-demo' : undefined}
              onClick={
                tagWithHref
                  ? undefined
                  : () => setTagClicks((count) => count + 1)
              }
              onDelete={
                tagWithDelete
                  ? () => setTagLabel((label) => `${label}*`)
                  : undefined
              }
            />
            <p className="mt-2 text-xs text-neutral-500">
              클릭 횟수: {tagClicks}
            </p>
          </div>
        </PageSection>

        <PageSection title="체크박스">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="라벨">
              <input
                className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={checkboxLabel}
                onChange={(event) => setCheckboxLabel(event.target.value)}
              />
            </ControlRow>
            <ControlRow label="선택됨">
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(event) => setCheckboxChecked(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="비활성화">
              <input
                type="checkbox"
                checked={checkboxDisabled}
                onChange={(event) => setCheckboxDisabled(event.target.checked)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Checkbox
              label={checkboxLabel}
              checked={checkboxChecked}
              disabled={checkboxDisabled}
              onChange={setCheckboxChecked}
            />
          </div>
        </PageSection>

        <PageSection title="드롭다운">
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Dropdown
              contents={dropdownOptions}
              selectedIndex={dropdownIndex}
              onClick={setDropdownIndex}
              height="h-9"
            />
            <p className="mt-2 text-xs text-neutral-500">
              선택된 인덱스: {dropdownIndex}
            </p>
          </div>
        </PageSection>

        <PageSection title="다이얼로그 / 알럿 다이얼로그">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              tone="neutral"
              onClick={() => setDialogOpen(true)}
            >
              다이얼로그 열기
            </Button>
            <Button
              variant="solid"
              tone="brand"
              onClick={() => setAlertOpen(true)}
            >
              알럿 열기
            </Button>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            ariaLabel="Demo dialog"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                다이얼로그 제목
              </h3>
              <p className="text-sm text-neutral-600">
                간단한 다이얼로그 미리보기입니다. 우측 상단 X로 닫을 수 있어요.
              </p>
            </div>
          </Dialog>
          <AlertDialog
            open={alertOpen}
            onOpenChange={setAlertOpen}
            description="알럿 다이얼로그 확인 동작을 테스트합니다."
            confirmText="확인"
            onConfirm={() => setAlertConfirmCount((count) => count + 1)}
          />
          <p className="text-xs text-neutral-500">
            확인 횟수: {alertConfirmCount}
          </p>
        </PageSection>

        <PageSection title="페이지네이션">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="전체 페이지">
              <input
                type="number"
                min={1}
                className="w-20 rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={paginationTotalPages}
                onChange={(event) =>
                  setPaginationTotalPages(Number(event.target.value))
                }
              />
            </ControlRow>
            <ControlRow label="비활성화">
              <input
                type="checkbox"
                checked={paginationDisabled}
                onChange={(event) =>
                  setPaginationDisabled(event.target.checked)
                }
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Pagination
              page={pageNum}
              totalPages={paginationTotalPages}
              disabled={paginationDisabled}
            />
            <p className="mt-2 text-xs text-neutral-500">
              현재 페이지: {pageNum} (URL query param)
            </p>
          </div>
        </PageSection>

        <PageSection title="캘린더">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="과거 비활성화">
              <input
                type="checkbox"
                checked={calendarDisablePast}
                onChange={(event) =>
                  setCalendarDisablePast(event.target.checked)
                }
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Calendar
              selected={calendarDate}
              onSelect={setCalendarDate}
              disabled={
                calendarDisablePast
                  ? {
                      before: (() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return today;
                      })(),
                    }
                  : undefined
              }
            />
          </div>
        </PageSection>

        <PageSection title="이미지">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="너비">
              <input
                type="number"
                min={120}
                className="w-24 rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={imageWidth}
                onChange={(event) => setImageWidth(Number(event.target.value))}
              />
            </ControlRow>
            <ControlRow label="품질">
              <input
                type="number"
                min={10}
                max={100}
                className="w-24 rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={imageQuality}
                onChange={(event) =>
                  setImageQuality(Number(event.target.value))
                }
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Image
              src={DEMO_IMAGE_SRC}
              alt="Demo"
              width={imageWidth}
              height={Math.round(imageWidth * 0.6)}
              quality={imageQuality}
            />
          </div>
        </PageSection>

        <PageSection title="HTML 뷰어">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="이미지 표시">
              <input
                type="checkbox"
                checked={htmlShowImage}
                onChange={(event) => setHtmlShowImage(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="HTML">
              <textarea
                className="w-full max-w-xl rounded-sm border border-neutral-300 p-2 text-sm"
                rows={4}
                value={htmlContent}
                onChange={(event) => setHtmlContent(event.target.value)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <HTMLViewer html={htmlContent} image={htmlImage} />
          </div>
        </PageSection>

        <PageSection title="노드">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="변형">
              <SelectControl
                value={nodeVariant}
                onChange={setNodeVariant}
                options={NODE_VARIANTS}
              />
            </ControlRow>
            <ControlRow label="톤">
              <SelectControl
                value={nodeTone}
                onChange={setNodeTone}
                options={[
                  { label: 'brand', value: 'brand' },
                  { label: 'neutral', value: 'neutral' },
                ]}
              />
            </ControlRow>
            <ControlRow label="방향">
              <SelectControl
                value={nodeDirection}
                onChange={setNodeDirection}
                options={[
                  { label: 'row', value: 'row' },
                  { label: 'col', value: 'col' },
                ]}
              />
            </ControlRow>
            <ControlRow label="확장">
              <input
                type="checkbox"
                checked={nodeGrow}
                onChange={(event) => setNodeGrow(event.target.checked)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <div className="h-20 w-full">
              <Node
                variant={nodeVariant}
                tone={nodeTone}
                direction={nodeDirection}
                grow={nodeGrow}
              />
            </div>
          </div>
        </PageSection>

        <PageSection title="코너 접힘 카드">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="테마">
              <SelectControl
                value={cornerTheme}
                onChange={setCornerTheme}
                options={CORNER_THEMES}
              />
            </ControlRow>
            <ControlRow label="애니메이션">
              <input
                type="checkbox"
                checked={cornerAnimation}
                onChange={(event) => setCornerAnimation(event.target.checked)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <CornerFoldedRectangle
              colorTheme={COLOR_THEME[cornerTheme]}
              triangleLength={1.25}
              radius={0.2}
              triangleDropShadow="drop-shadow(1px 2px 2px rgba(0,0,0,0.2))"
              rectangleDropShadow="drop-shadow(1px 2px 4px rgba(0,0,0,0.15))"
              animationType={cornerAnimation ? 'folding' : undefined}
              width="w-fit"
            >
              <div className="px-5 py-3 text-sm font-medium text-neutral-700">
                접힌 모서리
              </div>
            </CornerFoldedRectangle>
          </div>
        </PageSection>

        <PageSection title="에러 상태">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="제목">
              <input
                className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={errorTitle}
                onChange={(event) => setErrorTitle(event.target.value)}
              />
            </ControlRow>
            <ControlRow label="제목 표시">
              <input
                type="checkbox"
                checked={errorWithTitle}
                onChange={(event) => setErrorWithTitle(event.target.checked)}
              />
            </ControlRow>
            <ControlRow label="메시지">
              <input
                className="rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                value={errorMessage}
                onChange={(event) => setErrorMessage(event.target.value)}
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-900 p-4">
            <ErrorState
              title={errorWithTitle ? errorTitle : undefined}
              message={errorMessage}
              action={{
                label: '다시 시도',
                onClick: () => setErrorClicks((count) => count + 1),
              }}
            />
            <p className="mt-2 text-xs text-neutral-400">
              클릭 횟수: {errorClicks}
            </p>
          </div>
        </PageSection>

        <PageSection title="첨부파일">
          <div className="flex flex-wrap gap-4">
            <ControlRow label="첨부파일 표시">
              <input
                type="checkbox"
                checked={attachmentsVisible}
                onChange={(event) =>
                  setAttachmentsVisible(event.target.checked)
                }
              />
            </ControlRow>
          </div>
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
            <Attachments files={attachmentsVisible ? DEMO_ATTACHMENTS : []} />
          </div>
        </PageSection>
      </div>
    </div>
  );
}
