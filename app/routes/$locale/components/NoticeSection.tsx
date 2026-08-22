import 'dayjs/locale/ko';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import Image from '@/components/ui/Image';
import { useLanguage } from '@/hooks/useLanguage';
import useIsMobile from '@/hooks/useResponsive';
import type { AllMainNotice } from '@/types/api/v2';
import noticeGraphicImg from '../assets/noticeGraphic.avif';
import PlusIcon from '../assets/plus.svg?react';

// 공지 분류는 "넷 중 하나"인 상호배타 단일 선택이라 토글 버튼이 아니라 radiogroup이 맞다.
// 네이티브 radio(fieldset)로 그룹 시맨틱·화살표 키 이동을 브라우저가 처리하고, 시각은 pill로.
// as const로 label을 리터럴로 유지(useLanguage `t`가 등록된 키 union만 받음).
const NOTICE_TAGS = [
  { value: 'all', label: '전체' },
  { value: 'scholarship', label: '장학' },
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
] as const satisfies readonly { value: keyof AllMainNotice; label: string }[];

const noticeTagPillClass = (selected: boolean) =>
  clsx(
    'inline-flex cursor-pointer select-none items-center justify-center rounded-[1.875rem] border border-solid border-main-orange-dark px-3 py-[0.37rem] text-md font-medium transition duration-200',
    'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-main-orange-dark',
    selected
      ? 'bg-main-orange-dark text-[#202020]'
      : 'bg-[#202020] text-main-orange-dark',
  );

export default function NoticeSection({
  allMainNotice,
}: {
  allMainNotice: AllMainNotice;
}) {
  const [tag, setTag] = useState<keyof AllMainNotice>('all');
  const isMobile = useIsMobile();
  const { t, localizedPath, locale } = useLanguage();

  return (
    <div className="relative mt-16 bg-[#212121] sm:mx-31 sm:mt-22 sm:h-112">
      <div className="absolute left-0 top-0 hidden aspect-827/295 w-[77%] sm:block">
        <Image
          src={noticeGraphicImg}
          alt=""
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-col px-7 pb-6.5 pt-12 sm:absolute sm:bottom-12 sm:right-12 sm:w-132 sm:p-0">
        <h3 className="text-[1.75rem] font-semibold text-white">
          {t('공지사항')}
        </h3>
        <div className="mt-6 flex items-center justify-between sm:mt-9">
          <fieldset
            aria-label={t('공지사항')}
            className="m-0 flex gap-3.5 border-0 p-0"
          >
            {NOTICE_TAGS.map(({ value, label }) => (
              <label key={value} className={noticeTagPillClass(tag === value)}>
                <input
                  type="radio"
                  name="notice-tag"
                  value={value}
                  checked={tag === value}
                  onChange={() => setTag(value)}
                  className="sr-only"
                />
                {t(label)}
              </label>
            ))}
          </fieldset>
          {!isMobile && (
            <Link
              className="flex text-base font-normal text-main-orange-dark"
              to={localizedPath('/community/notice')}
            >
              <PlusIcon /> {t('더보기')}
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {allMainNotice[tag].map((notice) => (
            <Link
              key={notice.id}
              className="line-clamp-1 flex justify-between gap-2 text-md font-normal text-white sm:text-base"
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
            className="ml-auto mt-6 flex text-base font-normal text-main-orange-dark"
            to={localizedPath('/community/notice')}
          >
            <PlusIcon /> {t('더보기')}
          </Link>
        )}
      </div>
    </div>
  );
}
