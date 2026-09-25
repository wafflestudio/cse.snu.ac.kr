import BulletRow from './PeopleBulletRow';

interface PeopleInfoListProps {
  header: string;
  items: string[];
}

export default function PeopleInfoList({ header, items }: PeopleInfoListProps) {
  if (items.length === 0) return null;

  return (
    <article className="mb-8 flex flex-col text-neutral-700">
      <h3 className="mb-4 type-section">{header}</h3>
      <ul className="list-inside list-disc">
        {items.map((info, i) => (
          <BulletRow key={`${info}-${i}`}>{info}</BulletRow>
        ))}
      </ul>
    </article>
  );
}
