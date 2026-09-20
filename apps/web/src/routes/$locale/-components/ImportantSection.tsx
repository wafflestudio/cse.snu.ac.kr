import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/ui/Image';
import { useLanguage } from '@/hooks/useLanguage';
import type { MainImportant } from '@/types/api';
import charityImg from '../assets/charity.avif';

export default function ImportantSection({
  importantList,
}: {
  importantList: MainImportant[];
}) {
  return (
    <div className="page-inset-x mt-16 grid grid-cols-1 gap-8 sm:mt-22 sm:grid-cols-2 sm:gap-8">
      {importantList.map((important) => (
        <ImportantBanner key={important.id} important={important} />
      ))}
      <CharityBanner />
    </div>
  );
}

const ImportantBanner = ({ important }: { important: MainImportant }) => {
  const { localizedPath } = useLanguage();

  return (
    <Link
      to={localizedPath(`/community/${important.category}/${important.id}`)}
      className="relative flex h-[7.5rem] flex-col gap-2.5 bg-main-orange-muted px-7 pt-6.5"
    >
      <h3 className="line-clamp-1 text-lg font-medium text-neutral-950">
        {important.title}
      </h3>
      <p className="mr-6 line-clamp-1 text-sm font-normal text-neutral-950">
        {important.description}
      </p>
      <ImportantSectionArrow />
    </Link>
  );
};

const CharityBanner = () => (
  <a
    href="https://computingcommons.snu.ac.kr/"
    className="relative flex h-[7.5rem] flex-col gap-2.5 px-7 pt-6.5"
  >
    <Image
      src={charityImg}
      alt=""
      sizes="(min-width: 640px) 50vw, 100vw"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <h3 className="relative z-10 line-clamp-1 text-lg font-medium text-neutral-950">
      SNU Computing Commons 건축기금 모금
    </h3>
    <p className="relative z-10 line-clamp-1 text-sm font-normal text-neutral-950">
      서울대학교 발전재단 X 컴퓨터공학부
    </p>
    <ImportantSectionArrow />
  </a>
);

const ImportantSectionArrow = () => (
  <ArrowRight className="absolute bottom-[0.87rem] right-[0.87rem] size-7 text-neutral-950" />
);
