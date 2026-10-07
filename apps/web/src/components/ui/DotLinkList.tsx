import { Link } from '@tanstack/react-router';

// 주황 원 + 링크 목록(/design-system/list). 호버하면 원이 차고 글자가 짙은 주황.
interface DotLinkListProps {
  items: { key: string | number; to: string; label: string }[];
}

export default function DotLinkList({ items }: DotLinkListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.key} className="w-fit">
          <Link
            to={item.to}
            className="group flex items-center gap-2 px-3 py-2"
          >
            <span className="size-2.5 shrink-0 rounded-full border border-main-orange duration-300 group-hover:bg-main-orange" />
            <span className="type-ui duration-300 group-hover:text-main-orange-dark">
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
