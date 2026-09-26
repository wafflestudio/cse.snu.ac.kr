import 'dayjs/locale/ko';
import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from '@/components/ui/Image';
import PillGroup from '@/components/ui/PillGroup';
import { useLanguage } from '@/hooks/useLanguage';
import useIsMobile from '@/hooks/useResponsive';
import type { AllMainNotice } from '@/types/api';
import noticeGraphicImg from '../assets/noticeGraphic.avif';

// 공지 분류는 넷 중 하나 — 알약 단일 선택(어두운 면이라 주황, /design-system#selection).
// as const로 label을 리터럴로 유지(useLanguage `t`가 등록된 키 union만 받음).
const NOTICE_TAGS = [
  { value: 'all', label: '전체' },
  { value: 'scholarship', label: '장학' },
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
] as const satisfies readonly { value: keyof AllMainNotice; label: string }[];

export default function NoticeSection({
  allMainNotice,
}: {
  allMainNotice: AllMainNotice;
}) {
  const [tag, setTag] = useState<keyof AllMainNotice>('all');
  const isMobile = useIsMobile();
  const { t, localizedPath, locale } = useLanguage();

  return (
    <div className="relative mt-16 bg-neutral-850 sm:mx-32 sm:mt-16 sm:h-112">
      <div className="absolute left-0 top-0 hidden aspect-827/295 w-[77%] sm:block">
        <Image
          src={noticeGraphicImg}
          alt=""
          sizes="77vw"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-col px-6 pb-6 pt-12 sm:absolute sm:bottom-12 sm:right-12 sm:w-132 sm:p-0">
        <h3 className="type-headline text-white">{t('공지사항')}</h3>
        <div className="mt-6 flex items-center justify-between sm:mt-8">
          <PillGroup
            ariaLabel={t('공지사항')}
            tone="dark"
            options={NOTICE_TAGS.map(({ value, label }) => ({
              value,
              label: t(label),
            }))}
            value={tag}
            onChange={setTag}
          />
          {!isMobile && (
            <Link
              className="flex items-center gap-1 type-ui text-main-orange-dark"
              to={localizedPath('/community/notice')}
            >
              {t('더보기')} <ArrowRight />
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {allMainNotice[tag].map((notice) => (
            <Link
              key={notice.id}
              className="line-clamp-1 flex justify-between gap-2 type-ui text-white"
              to={localizedPath(`/community/notice/${notice.id}`)}
            >
              <h3 className="truncate sm:w-108">{notice.title}</h3>
              <p className="whitespace-nowrap">
                {dayjs(notice.createdAt)
                  .locale(locale)
                  .format(
                    locale === 'ko' ? 'YYYY/M/DD (ddd)' : 'YYYY/M/DD ddd',
                  )}
              </p>
            </Link>
          ))}
        </div>
        {isMobile && (
          <Link
            className="ml-auto mt-6 flex items-center gap-1 type-ui text-main-orange-dark"
            to={localizedPath('/community/notice')}
          >
            {t('더보기')} <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}
