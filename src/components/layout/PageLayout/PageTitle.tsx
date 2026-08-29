import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import Node from '@/components/ui/Nodes';
import { useLanguage } from '@/hooks/useLanguage';
import type { BreadcrumbItem } from './index';

interface PageTitleProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  titleSize: 'xl' | 'lg';
  margin: string;
}

export default function PageTitle({
  title,
  subtitle,
  breadcrumb,
  titleSize,
  margin,
}: PageTitleProps) {
  const titleStyle =
    titleSize === 'xl' ? 'text-2xl font-bold' : 'text-lg font-medium';

  return (
    <div className="px-5 pt-[54px] sm:px-25">
      <div
        className={`col-start-1 row-start-1 w-fit min-w-62.5 max-w-207.5 ${margin}`}
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          {breadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb items={breadcrumb} />
          )}
          <Node variant="curvedHorizontalGray" />
        </div>
        {title && (
          <h3 className="mr-25">
            {subtitle ? (
              <span className="flex items-end">
                <span
                  className={`${titleStyle} break-keep text-[24px] tracking-wide text-white sm:text-[32px]`}
                >
                  {title}
                </span>
                <span className="ml-2 text-md font-normal leading-7 text-neutral-500 tracking-wider">
                  {subtitle}
                </span>
              </span>
            ) : (
              <span
                className={`${titleStyle} break-keep text-[24px] tracking-wide text-white sm:text-[32px]`}
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

  return (
    <ol className="flex items-center gap-0.5 text-neutral-300">
      {items.map((item, i) => {
        const isCurrent = item.path
          ? pathname === localizedPath(item.path)
          : false;

        return (
          <Fragment key={`${item.name}-${i}`}>
            <li className="flex">
              <LocationText
                path={item.path}
                name={item.name}
                isCurrent={isCurrent}
              />
            </li>
            {i !== items.length - 1 && (
              <li className="text-xs">
                <ChevronRight className="h-[12px] w-[12px]" strokeWidth={1.5} />
              </li>
            )}
          </Fragment>
        );
      })}
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
  const textStyle = 'text-xs sm:text-md font-normal tracking-[.02em]';

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
