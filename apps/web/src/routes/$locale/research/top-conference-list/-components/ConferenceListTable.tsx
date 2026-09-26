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
      {/* 칸 틀은 표에 한 번만 — 머리 행·행이 같이 쓴다(subgrid). */}
      <div className="mt-8 grid w-180 grid-cols-[auto_auto_minmax(0,1fr)] border-y border-neutral-200 type-ui">
        <div className="col-span-full grid h-11 grid-cols-subgrid whitespace-nowrap border-b border-neutral-200 type-label text-neutral-950">
          <div className="flex items-center justify-center px-3">
            {t('연번')}
          </div>
          <div className="flex items-center px-3">{t('약칭')}</div>
          <div className="flex items-center px-3">{t('학술대회 명칭')}</div>
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
    <div className="col-span-full grid min-h-11 grid-cols-subgrid items-center wrap-break-word type-ui even:bg-neutral-50">
      <div className="flex items-center justify-center px-3 py-3">{index}</div>
      <div className="flex items-center px-3 py-3">
        {conference.abbreviation}
      </div>
      <div className="flex items-center px-3 py-3">{conference.name}</div>
    </div>
  );
}
