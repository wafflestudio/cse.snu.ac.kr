import { useLanguage } from '@/hooks/useLanguage';
import type { TopConferenceListResponse } from '@/types/api';

interface ConferenceListTableProps {
  conferenceList: TopConferenceListResponse['conferenceList'];
}

export default function ConferenceListTable({
  conferenceList,
}: ConferenceListTableProps) {
  const { t } = useLanguage({
    연번: 'No.',
    약칭: 'Abbr.',
    '학술대회 명칭': 'Conference Name',
  });

  return (
    <div className="overflow-x-scroll">
      <div className="mt-8 flex w-180 flex-col type-ui">
        <div className="flex h-10 w-full flex-row border-y border-y-neutral-200">
          <div className="flex w-12 items-center justify-center px-3">
            {t('연번')}
          </div>
          <div className="flex w-28 items-center px-3">{t('약칭')}</div>
          <div className="flex w-135 items-center px-3">
            {t('학술대회 명칭')}
          </div>
        </div>
        {conferenceList.map((conference, index) => (
          <ConferenceRow
            conference={conference}
            index={index + 1}
            key={conference.id}
          />
        ))}
      </div>
    </div>
  );
}

function ConferenceRow({
  conference,
  index,
}: {
  conference: TopConferenceListResponse['conferenceList'][number];
  index: number;
}) {
  return (
    <div className="flex w-full flex-row items-center wrap-break-word type-ui even:bg-neutral-100">
      <div className="flex w-12 items-center justify-center px-3 py-3">
        {index}
      </div>
      <div className="flex w-28 items-center px-3 py-3">
        {conference.abbreviation}
      </div>
      <div className="flex w-135 items-center px-3 py-3">{conference.name}</div>
    </div>
  );
}
