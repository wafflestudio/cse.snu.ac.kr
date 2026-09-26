import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import Node from '@/components/ui/Nodes';
import { useLanguage } from '@/hooks/useLanguage';
import type { BreadcrumbItem } from './index';

interface PageTitleProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function PageTitle({
  title,
  subtitle,
  breadcrumb,
}: PageTitleProps) {
  return (
    <div className="px-5 pt-12 sm:px-25">
      <div
        className={`col-start-1 row-start-1 w-fit min-w-62.5 max-w-207.5 mb-6 sm:mb-12`}
      >
        <div className="mb-2">
          <Breadcrumb items={breadcrumb ?? []} />
        </div>
        {title && (
          <h3 className="mr-25">
            {subtitle ? (
              <span className="flex items-end">
                <span
                  className={
                    'type-page-title break-keep wrap-anywhere tracking-wide text-white'
                  }
                >
                  {title}
                </span>
                <span className="ml-2 type-body text-neutral-500 tracking-wider">
                  {subtitle}
                </span>
              </span>
            ) : (
              <span
                className={
                  'type-page-title break-keep wrap-anywhere tracking-wide text-white'
                }
              >
                {title}
              </span>
            )}
          </h3>
        )}
      </div>
    </div>
  );
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { pathname } = useLocation();
  const { localizedPath } = useLanguage();

  // 항목 안에서는 줄을 바꾸지 않고 항목 단위로 넘어간다(왼쪽 정렬). 화살표는 뒤 항목에 붙는다.
  // 곡선 그래픽은 마지막 항목 뒤에서 남은 자리를 채우고, 자리가 없으면 함께 다음 줄로 간다.
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-neutral-300">
      {items.map((item, i) => {
        const isCurrent = item.path
          ? pathname === localizedPath(item.path)
          : false;

        return (
          <li
            key={`${item.name}-${i}`}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {i > 0 && <ChevronRight className="type-meta" />}
            <LocationText
              path={item.path}
              name={item.name}
              isCurrent={isCurrent}
            />
          </li>
        );
      })}
      <li aria-hidden className="ml-1 flex min-w-14 grow">
        <Node variant="curvedHorizontalGray" />
      </li>
    </ol>
  );
}

interface LocationTextProps {
  path?: string;
  name: string;
  isCurrent: boolean;
}

function LocationText({ path, name, isCurrent }: LocationTextProps) {
  const { localizedPath } = useLanguage();
  const _navigate = useNavigate();
  const router = useRouter();
  const textStyle = 'type-meta tracking-[.02em]';

  if (isCurrent) {
    // 브레드크럼 현재 항목: 형제 Link/span과 색을 맞춰야 해 색을 상속받는다(text-inherit).
    // Button의 어떤 kind도 색 상속을 표현하지 않으므로 형제와 동일 스타일의 평범한 버튼으로 둔다.
    return (
      <button
        type="button"
        onClick={() => router.history.go(0)}
        className={`inline-flex items-center justify-center gap-2 transition duration-200 ${textStyle} text-inherit hover:text-main-orange`}
      >
        <span>{name}</span>
      </button>
    );
  }

  if (path) {
    return (
      <Link
        to={localizedPath(path)}
        className={`${textStyle} hover:text-main-orange`}
      >
        {name}
      </Link>
    );
  }

  return <span className={textStyle}>{name}</span>;
}
