import { useReducer } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import Button from '@/components/ui/Button';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import {
  CareerCompanyEditor,
  type CareerCompanyFormData,
  CompanyTableRow,
} from '@/routes/$locale/about/future-careers/-components/CompanyRow';
import type { Company } from '@/types/api';
import { api } from '@/utils/api';

export default function CareerCompanies({
  companies,
}: {
  companies: Company[];
}) {
  const { t } = useLanguage({ '졸업생 창업 기업': 'Startup Companies' });
  const [showCreateForm, toggleCreateForm] = useReducer((x) => !x, false);

  const onCreate = async (content: CareerCompanyFormData) => {
    try {
      await api.post('v2/about/future-careers/company', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      toast.success('졸업생 창업 기업을 추가했습니다.');
      toggleCreateForm();
      window.location.reload();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="mt-12 sm:max-w-fit">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="type-item">{t('졸업생 창업 기업')}</h3>
        {/* UI가 과하게 깨지는 관계로 모바일 버전에서는 편집 X */}
        <div className="hidden sm:block">
          <LoginVisible allow="ROLE_STAFF">
            <Button
              variant="primary"
              size="md"
              onClick={toggleCreateForm}
              disabled={showCreateForm}
            >
              기업 추가
            </Button>
          </LoginVisible>
        </div>
      </div>
      {/* 칸 틀은 목록에 한 번만 — 머리 행·행·편집 행이 같이 쓴다(subgrid). */}
      <div className="border-y border-neutral-200 type-ui sm:grid sm:grid-cols-[auto_auto_auto_auto_auto] sm:gap-x-6">
        <CompanyTableHeader />
        {showCreateForm && (
          <CareerCompanyEditor
            onCancel={toggleCreateForm}
            onSubmit={onCreate}
          />
        )}
        <ol className="sm:col-span-full sm:grid sm:grid-cols-subgrid">
          {companies.map((company, index) => (
            <CompanyTableRow
              key={company.id}
              index={index + 1}
              company={company}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function CompanyTableHeader() {
  const { t } = useLanguage({
    연번: 'No.',
    '창업 기업명': 'Company Name',
    홈페이지: 'Website',
    창업연도: 'Year Founded',
  });

  return (
    <div className="hidden h-11 items-center whitespace-nowrap border-b border-neutral-200 type-label text-neutral-950 sm:col-span-full sm:grid sm:grid-cols-subgrid sm:px-3">
      <p className="pl-2">{t('연번')}</p>
      <p className="pl-2">{t('창업 기업명')}</p>
      <p className="pl-2">{t('홈페이지')}</p>
      <p className="pl-2">{t('창업연도')}</p>
      {/* 표 본문과 UI 정렬을 맞추기 위함 */}
      <LoginVisible allow="ROLE_STAFF">
        <p />
      </LoginVisible>
    </div>
  );
}
