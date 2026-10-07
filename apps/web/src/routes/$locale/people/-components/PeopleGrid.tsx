import { Link } from '@tanstack/react-router';
import Image from '@/components/ui/Image';

interface PeopleGridProps {
  items: PeopleCardProps[];
}

export default function PeopleGrid({ items }: PeopleGridProps) {
  return (
    <div className="grid max-w-3xl gap-16 sm:grid-cols-[repeat(auto-fit,144px)]">
      {items.map((item) => (
        <PeopleCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export interface PeopleCardContentItem {
  text: string;
  href?: string;
}

export interface PeopleCardProps {
  id: string | number;
  imageURL: string | null;
  name: string;
  subtitle: string;
  href: string;
  titleNewline?: boolean;
  content: PeopleCardContentItem[];
}

function PeopleCard({
  imageURL,
  name,
  subtitle,
  href,
  titleNewline = false,
  content,
}: PeopleCardProps) {
  return (
    <article className="group flex w-fit flex-row gap-6 type-ui sm:w-36 sm:flex-col sm:gap-3">
      <Link
        to={href}
        className="relative h-48 w-36 shrink-0 cursor-pointer overflow-hidden"
        aria-label={`${name} 교수 상세 페이지로 이동`}
      >
        {/* 사진 틀 3:4 — 사진이 없으면 같은 틀에 로고(Image 가 그린다). */}
        <Image
          src={imageURL}
          alt={`${name} 프로필`}
          className="h-48 w-36 object-cover"
          width={144}
          sizes="144px"
          height={192}
          loading="lazy"
        />
      </Link>
      <div className="flex flex-col items-start">
        <Link
          to={href}
          // 밑줄은 이름·직함 글자 폭만큼(모바일). 데스크톱은 카드 폭 144.
          className={`relative flex w-fit cursor-pointer flex-row flex-wrap gap-2 pb-2 sm:w-full ${
            titleNewline ? 'flex-col' : ''
          }`}
        >
          <span className="type-item">{name}</span>
          <AcademicRankText academicRank={subtitle} />
          <HoverAnimationUnderline />
        </Link>

        <div className="mt-3 flex flex-col items-start gap-2">
          {content.map(({ text, href }, idx) =>
            href ? (
              <Link
                key={`${text}-${idx}`}
                to={href}
                className="hover:text-main-orange-dark"
              >
                <p>{text}</p>
              </Link>
            ) : (
              <p key={`${text}-${idx}`}>{text}</p>
            ),
          )}
        </div>
      </div>
    </article>
  );
}

const HoverAnimationUnderline = () => (
  <>
    <span className="absolute bottom-0 inline-block w-full border-b border-neutral-200" />
    <span className="absolute bottom-0 inline-block w-0 border-b border-main-orange transition-all duration-700 ease-out group-hover:w-full" />
  </>
);

function AcademicRankText({ academicRank }: { academicRank: string }) {
  return (
    <p className="mb-px flex flex-wrap items-end text-neutral-500">
      {academicRank.split('(').map((rank, i) =>
        i === 0 ? (
          <span key={rank}>{rank}</span>
        ) : (
          <span
            key={rank}
            className="inline-block origin-left scale-75 whitespace-nowrap"
          >
            ({rank}
          </span>
        ),
      )}
    </p>
  );
}
