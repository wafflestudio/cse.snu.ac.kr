import { useLanguage } from '~/hooks/useLanguage';
import type { Company } from '~/types/api/v2/about/future-careers';

const TABLE_COLUMN_SIZE = [
  'sm:w-[3rem]',
  'sm:w-[12.5rem]',
  'sm:w-80',
  'sm:w-20',
];

export default function CareerCompanies({
  companies,
}: {
  companies: Company[];
}) {
  const { t } = useLanguage({ '졸업생 창업 기업': 'Startup Companies' });

  return (
    <div className="mt-11 sm:max-w-fit">
      <div className="mb-3">
        <h3 className="text-base font-bold">{t('졸업생 창업 기업')}</h3>
      </div>
      <div className="border-y border-neutral-200 text-sm font-normal">
        <CompanyTableHeader />
        <ol>
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
    <div className="hidden h-10 items-center gap-3 whitespace-nowrap border-b border-neutral-200 sm:flex sm:px-3">
      <p className={TABLE_COLUMN_SIZE[0]}>{t('연번')}</p>
      <p className={`${TABLE_COLUMN_SIZE[1]} pl-2`}>{t('창업 기업명')}</p>
      <p className={`${TABLE_COLUMN_SIZE[2]} pl-2`}>{t('홈페이지')}</p>
      <p className={`${TABLE_COLUMN_SIZE[3]} pl-2`}>{t('창업연도')}</p>
    </div>
  );
}

interface CompanyTableRowProps {
  index: number;
  company: Company;
}

function CompanyTableRow({ index, company }: CompanyTableRowProps) {
  const { name, url, year } = company;

  return (
    <li className="grid grid-cols-[22px_auto_1fr] items-center gap-x-1 px-7 py-6 odd:bg-neutral-100 sm:flex sm:h-10 sm:gap-3 sm:p-0 sm:px-3">
      <p className={`text-sm text-neutral-400 sm:pl-2 ${TABLE_COLUMN_SIZE[0]}`}>
        {index}
      </p>
      <p
        className={`text-md font-medium sm:pl-2 sm:text-sm sm:font-normal ${TABLE_COLUMN_SIZE[1]}`}
      >
        {name}
      </p>
      <a
        className={`order-last col-span-2 col-start-2 w-fit text-xs text-link hover:underline sm:order-0 sm:mt-0 sm:pl-2
          ${url && 'mt-1'} ${TABLE_COLUMN_SIZE[2]}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
      <p className={`pl-2 text-sm text-neutral-400 ${TABLE_COLUMN_SIZE[3]}`}>
        {year}
      </p>
    </li>
  );
}
