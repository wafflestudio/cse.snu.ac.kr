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
    <div className="mt-12 grid grid-cols-1 gap-8 sm:mx-32 sm:mt-16 sm:grid-cols-2 sm:gap-8">
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
      className="relative flex min-h-30 flex-col gap-2 pb-12 bg-main-orange-dark px-6 pt-6"
    >
      <h3 className="line-clamp-2 text-balance type-section text-neutral-950 sm:line-clamp-1">
        {important.title}
      </h3>
      <p className="mr-6 line-clamp-1 type-meta text-neutral-950">
        {important.description}
      </p>
      <ImportantSectionArrow />
    </Link>
  );
};

const CharityBanner = () => (
  <a
    href="https://computingcommons.snu.ac.kr/"
    className="relative flex min-h-30 flex-col gap-2 pb-12 px-6 pt-6"
  >
    <Image
      src={charityImg}
      alt=""
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <h3 className="relative z-10 line-clamp-2 text-balance type-section text-neutral-950 sm:line-clamp-1">
      SNU Computing Commons 건축기금 모금
    </h3>
    <p className="relative z-10 line-clamp-1 type-meta text-neutral-950">
      서울대학교 발전재단 X 컴퓨터공학부
    </p>
    <ImportantSectionArrow />
  </a>
);

const ImportantSectionArrow = () => (
  <ArrowRight className="absolute bottom-4 right-4 size-7 text-neutral-950" />
);
