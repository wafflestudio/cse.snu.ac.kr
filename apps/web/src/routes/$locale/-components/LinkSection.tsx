import { useLanguage } from '@/hooks/useLanguage';
import LinkRow from './LinkRow';

export default function LinkSection() {
  const { t, localizedPath, locale } = useLanguage();
  // 한국어 제목 옆에 영어 부제를 두는 줄 — 영어 화면에서는 영어 하나만.
  const row = (ko: string, en: string) =>
    locale === 'en' ? { title: en } : { title: ko, subtitle: en };

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
            {...row('신임교수초빙', 'Faculty Recruitment')}
          />
          <LinkRow
            to={localizedPath('/people/faculty')}
            {...row('구성원', 'Faculty')}
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
            {...row('필수 교양 과목', 'General Studies Requirements')}
          />
          <LinkRow
            to={localizedPath('/academics/undergraduate/degree-requirements')}
            {...row('졸업 규정', 'Degree Requirements')}
          />
        </div>
      </div>
    </div>
  );
}
