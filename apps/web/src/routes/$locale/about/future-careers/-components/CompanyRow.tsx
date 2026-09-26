import { useRouter } from '@tanstack/react-router';
import { useReducer, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import Form from '@/components/form/Form';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { toast, toastError } from '@/components/ui/sonner';
import type { Company } from '@/types/api';
import { api } from '@/utils/api';

interface CompanyTableRowProps {
  index: number;
  company: Company;
}

export function CompanyTableRow({ index, company }: CompanyTableRowProps) {
  const [edit, toggleEdit] = useReducer((x) => !x, false);
  const router = useRouter();

  const onSubmit = async (content: CareerCompanyFormData) => {
    try {
      await api.put(`v2/about/future-careers/company/${company.id}`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: company.id, ...content }),
      });

      toast.success('졸업생 창업 기업을 수정했습니다.');
      toggleEdit();
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return edit ? (
    <CareerCompanyEditor
      index={index}
      company={company}
      onSubmit={onSubmit}
      onCancel={toggleEdit}
    />
  ) : (
    <CareerCompanyViewer
      index={index}
      company={company}
      toggleEdit={toggleEdit}
    />
  );
}

function CareerCompanyViewer({
  index,
  company,
  toggleEdit,
}: CompanyTableRowProps & { toggleEdit: () => void }) {
  const { id, name, url, year } = company;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await api.delete(`v2/about/future-careers/company/${id}`);

      setShowDeleteDialog(false);
      toast.success('졸업생 창업 기업을 삭제했습니다.');
      toggleEdit();
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <li className="grid grid-cols-[22px_auto_1fr] items-center gap-x-1 px-6 py-6 odd:bg-neutral-50 sm:col-span-full sm:grid-cols-subgrid sm:h-11 sm:p-0 sm:px-3">
        <p className={`type-ui text-neutral-500 sm:pl-2`}>{index}</p>
        <p className={`type-ui sm:pl-2`}>{name}</p>
        <a
          className={`order-last col-span-2 col-start-2 w-fit type-meta sm:col-span-1 sm:col-start-auto text-link underline underline-offset-2 sm:order-0 sm:mt-0 sm:pl-2
            ${url && 'mt-1'}`}
          href={url ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
        <p className={`pl-2 type-ui text-neutral-500`}>{year}</p>
        <LoginVisible allow="ROLE_STAFF">
          <div className={`hidden shrink-0 justify-end gap-3 sm:flex`}>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteDialog(true)}
            >
              삭제
            </Button>
            <Button variant="secondary" onClick={toggleEdit}>
              편집
            </Button>
          </div>
        </LoginVisible>
      </li>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={`‘${name}’ 창업 기업을 삭제하시겠습니까?\n되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}

export interface CareerCompanyFormData {
  name: string;
  url: string;
  year: number;
}

export function CareerCompanyEditor({
  index,
  company,
  onSubmit,
  onCancel,
}: Partial<CompanyTableRowProps> & {
  onSubmit: (formData: CareerCompanyFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const formMethods = useForm<CareerCompanyFormData>({
    defaultValues: {
      name: company?.name ?? '',
      url: company?.url ?? '',
      year: company?.year ?? undefined,
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <li className="grid grid-cols-[22px_auto_1fr] items-center gap-x-1 px-6 py-6 odd:bg-neutral-50 sm:col-span-full sm:grid-cols-subgrid sm:h-11 sm:p-0 sm:px-3">
        <p className={`type-ui text-neutral-500 sm:pl-2`}>{index}</p>
        <div className={`type-ui`}>
          <Form.Text name="name" />
        </div>
        <div className={`type-ui`}>
          <Form.Text name="url" />
        </div>
        <div className={`type-ui`}>
          <Form.Text
            name="year"
            type="number"
            options={{ valueAsNumber: true }}
          />
        </div>
        <LoginVisible allow="ROLE_STAFF">
          <div className={`hidden shrink-0 justify-end gap-3 sm:flex`}>
            <Button variant="secondary" onClick={onCancel}>
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              pending={isSubmitting}
              pendingLabel="저장 중…"
            >
              저장
            </Button>
          </div>
        </LoginVisible>
      </li>
    </FormProvider>
  );
}
