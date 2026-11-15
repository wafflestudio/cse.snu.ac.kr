import 'dayjs/locale/ko';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import Image from '@/components/ui/Image';
import { useLanguage } from '@/hooks/useLanguage';
import useIsMobile from '@/hooks/useResponsive';
import type { AllMainNotice } from '@/types/api';
import noticeGraphicImg from '../assets/noticeGraphic.avif';
import PlusIcon from '../assets/plus.svg?react';

// 공지 분류는 "다섯 중 하나"인 상호배타 단일 선택이라 토글 버튼이 아니라 radiogroup이 맞다.
// 네이티브 radio(fieldset)로 그룹 시맨틱·화살표 키 이동을 브라우저가 처리하고, 시각은 pill로.
// as const로 label을 리터럴로 유지(useLanguage `t`가 등록된 키 union만 받음).
const NOTICE_TAGS = [
  { value: 'all', label: '전체' },
  { value: 'scholarship', label: '장학' },
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
] as const satisfies readonly { value: keyof AllMainNotice; label: string }[];

// 채용 공지는 공지사항이 아니라 채용정보 페이지(/community/jobs)에 모은다. 그래서 '전체'에 안 들어가고,
// 같은 줄에 두되 세로선 뒤에 따로 둬 공지 분류가 아님을 보인다(2026-11 행정실 요청).
const RECRUIT_TAG = { value: 'recruit', label: '채용정보' } as const satisfies {
  value: keyof AllMainNotice;
  label: string;
};

const noticeTagPillClass = (selected: boolean) =>
  clsx(
    'inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-[1.875rem] border border-solid border-main-orange-dark px-2.5 py-[0.37rem] text-md font-medium transition duration-200 sm:px-3',
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
  const morePath = localizedPath(
    tag === RECRUIT_TAG.value ? '/community/jobs' : '/community/notice',
  );

  const pill = ({
    value,
    label,
  }: {
    value: keyof AllMainNotice;
    label: string;
  }) => (
    <label key={value} className={noticeTagPillClass(tag === value)}>
      <input
        type="radio"
        name="notice-tag"
        value={value}
        checked={tag === value}
        onChange={() => setTag(value)}
        className="sr-only"
      />
      {label}
    </label>
  );

  return (
    <div className="relative mt-16 bg-[#212121] sm:mx-31 sm:mt-22 sm:h-112">
      <div className="absolute left-0 top-0 hidden aspect-827/295 w-[77%] sm:block">
        <Image
          src={noticeGraphicImg}
          alt=""
          sizes="77vw"
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
            // 모바일 360px 폭에 알약 다섯과 세로선이 한 줄에 들도록 간격·여백을 줄인다. 더 좁으면 줄을 넘긴다
            className="m-0 flex flex-wrap items-center gap-x-1.5 gap-y-2 border-0 p-0 sm:gap-x-3.5"
          >
            {NOTICE_TAGS.map(({ value, label }) =>
              pill({ value, label: t(label) }),
            )}
            <span
              aria-hidden
              className="mx-0.5 h-5 w-px bg-[#5c5c5c] sm:mx-0"
            />
            {pill({ value: RECRUIT_TAG.value, label: t(RECRUIT_TAG.label) })}
          </fieldset>
          {!isMobile && (
            <Link
              className="flex text-base font-normal text-main-orange-dark"
              to={morePath}
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
            to={morePath}
          >
            <PlusIcon /> {t('더보기')}
          </Link>
        )}
      </div>
    </div>
  );
}
