import Button from '@/components/ui/Button';
import { TOAST_ICONS, toast } from '@/components/ui/sonner';
import {
  DocSection,
  Example,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';

// 토스트 페이지. 실제 toast 를 띄운다. 판·글자·아이콘·자리는 부품이 정하므로 적지 않는다.

function Kind({
  icon,
  label,
}: {
  icon: keyof typeof TOAST_ICONS;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 type-label [&_svg]:size-5">
      {TOAST_ICONS[icon]}
      {label}
    </span>
  );
}

export function ToastSection() {
  return (
    <>
      <Lead>토스트는 수행한 작업의 결과를 잠시 알릴 때 사용합니다.</Lead>

      <DocSection title="예시">
        <Example caption="버튼을 누르면 토스트가 표시됩니다.">
          <Button
            variant="secondary"
            onClick={() => toast.success('게시물을 저장했습니다.')}
          >
            성공
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error('저장하지 못했습니다.', {
                description: '잠시 후 다시 시도해 주세요.',
              })
            }
          >
            실패
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info('로그인이 필요합니다.')}
          >
            안내
          </Button>
        </Example>
      </DocSection>

      <DocSection title="종류">
        <VariantTable
          rows={[
            {
              name: '성공',
              sample: <Kind icon="success" label="저장했습니다" />,
              use: '완료한 작업(저장·삭제·게시).',
            },
            {
              name: '실패',
              sample: <Kind icon="error" label="저장하지 못했습니다" />,
              use: '실패한 작업. 문장은 오류마다 정해 둔 것을 씁니다.',
            },
            {
              name: '안내',
              sample: <Kind icon="info" label="로그인이 필요합니다" />,
              use: '해야 할 일(로그인 필요 등).',
            },
          ]}
        />
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '방금 누른 버튼의 결과(했는지, 실패했는지)를 알릴 때 사용합니다. 문장은 문구 페이지를 따릅니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '토스트는 몇 초 뒤 사라지고 누를 것이 없습니다. 그래서 입력 오류는 필드 아래(입력·폼), 실행 전 확인은 확인창(모달), 오래 읽을 안내는 화면에 둡니다.',
          ]}
        />
      </DocSection>
    </>
  );
}
