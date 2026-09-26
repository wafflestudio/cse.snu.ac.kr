import { useLanguage } from '@/hooks/useLanguage';
import LinkRow from './LinkRow';

export default function LinkSection() {
  const { t, localizedPath } = useLanguage();

  return (
    <div className="mx-6 mb-16 mt-16 flex flex-col gap-16 sm:mx-32 sm:mb-32 sm:mt-16 sm:flex-row sm:gap-32">
      <div className="flex flex-1 flex-col gap-6 sm:gap-8">
        <h3 className="type-section text-neutral-400">{t('바로가기')}</h3>
        <div className="flex flex-col gap-5">
          <LinkRow
            to={localizedPath('/research/top-conference-list')}
            title="Top Conference List"
          />
          <LinkRow
            to={localizedPath('/community/faculty-recruitment')}
            title="신임교수초빙"
            subtitle="Faculty Recruitment"
          />
          <LinkRow
            to={localizedPath('/people/faculty')}
            title="구성원"
            subtitle="Faculty"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 sm:gap-8">
        <h3 className="type-section text-neutral-400">{t('학부')}</h3>
        <div className="flex flex-col gap-5">
          <LinkRow
            to={localizedPath(
              '/academics/undergraduate/general-studies-requirements',
            )}
            title="필수 교양 과목"
            subtitle="General Studies Requirements"
          />
          <LinkRow
            to={localizedPath('/academics/undergraduate/degree-requirements')}
            title="졸업 규정"
            subtitle="Degree Requirements"
          />
        </div>
      </div>
    </div>
  );
}
