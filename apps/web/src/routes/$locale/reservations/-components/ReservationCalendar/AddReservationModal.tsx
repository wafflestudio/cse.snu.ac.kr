import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import Form from '@/components/form/Form';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { useLanguage } from '@/hooks/useLanguage';
import useReservationForm from '@/routes/$locale/reservations/-hooks/useReservationForm';
import PrivacyPolicyLink from './PrivacyPolicyLink';

interface AddReservationModalProps {
  roomId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddReservationModal({
  roomId,
  open,
  onOpenChange,
}: AddReservationModalProps) {
  const { t } = useLanguage({
    '시설 예약': 'Reservation',
    예약: 'Reserve',
    취소: 'Cancel',
    '예약 중…': 'Reserving…',
    '개인정보 수집 및 이용동의': 'Privacy Agreement',
  });

  const {
    methods,
    isSubmitting,
    isValid,
    startOptionItems,
    endOptionItems,
    recurringOptions,
    updateDate,
    updateStartTime,
    updateEndTime,
    onSubmit,
  } = useReservationForm({
    roomId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={t('시설 예약')}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <div className="mb-6 flex flex-col items-start gap-3">
            {/* 모바일은 이름을 위로 — 달력 팝오버가 판 폭 안에 들어오게. */}
            <fieldset className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label htmlFor="date" className="type-label">
                예약 날짜:
              </label>
              <Form.Date
                name="date"
                hideTime
                disablePast
                onSelect={updateDate}
              />
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <fieldset className="flex items-center gap-2">
                <label htmlFor="startTime" className="type-label">
                  시작 시간:
                </label>
                <Form.Dropdown
                  name="startTime"
                  contents={startOptionItems}
                  onChange={(value) => updateStartTime(String(value))}
                />
              </fieldset>
              <fieldset className="flex items-center gap-2">
                <label htmlFor="endTime" className="type-label">
                  종료 시간:
                </label>
                <Form.Dropdown
                  name="endTime"
                  contents={endOptionItems}
                  onChange={(value) => updateEndTime(String(value))}
                />
              </fieldset>
            </div>

            <fieldset className="flex items-center gap-2">
              <label htmlFor="recurringWeeks" className="type-label">
                매주 반복:
              </label>
              <Form.Dropdown
                name="recurringWeeks"
                contents={recurringOptions}
                onChange={(value) => {
                  methods.setValue('recurringWeeks', Number(value));
                }}
              />
              회
            </fieldset>
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <Fieldset title="단체 이름" required>
              <Form.Text
                name="title"
                placeholder=""
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>
            <Fieldset title="연락가능 이메일" required>
              <Form.Text
                name="contactEmail"
                type="email"
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>
            <Fieldset title="연락가능 전화번호" required>
              <Form.Text name="contactPhone" type="tel" />
            </Fieldset>
            <Fieldset title="지도교수" required>
              <Form.Text
                name="professor"
                placeholder=""
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>

            <Fieldset title="사용 목적" required fullWidth>
              <Form.TextArea
                name="purpose"
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>

            <div className="flex items-center gap-1 type-meta text-neutral-500">
              <AlertCircle className="shrink-0" />
              <p>예약 시간 20분 후까지 사용하지 않을 시 예약이 취소됩니다.</p>
            </div>
          </div>

          <fieldset className="mb-6 flex flex-col">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Form.Checkbox
                  name="agreed"
                  value="true"
                  label={t('개인정보 수집 및 이용동의')}
                  options={{ validate: (value) => value === 'true' }}
                />
                <span className="text-main-orange">*</span>
              </div>

              <PrivacyPolicyLink />
            </div>
          </fieldset>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onOpenChange(false)}
            >
              {t('취소')}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={!isValid}
              pending={isSubmitting}
              pendingLabel={t('예약 중…')}
            >
              {t('예약')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

function Fieldset({
  title,
  required = false,
  fullWidth = false,
  children,
}: {
  title: string;
  required?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className={fullWidth ? 'w-full' : 'w-full max-w-88'}>
      <legend className="mb-1 type-label">
        {title}
        {required && <span className="text-main-orange">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}
