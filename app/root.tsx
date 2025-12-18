import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';

import './app.css';
import type { Route } from '.react-router/types/app/+types/root';
import clsx from 'clsx';

export default function App({ params }: Route.ComponentProps) {
  const location = useLocation();
  const isMain = location.pathname === '/';
  const paddingLeft = isMain ? `sm:pl-[11rem]` : 'sm:pl-[6.25rem]';

  return (
    <html
      lang={params.locale}
      className="bg-neutral-900 font-normal text-neutral-950"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="sm:min-w-[1200px]">
        <main
          className={clsx('flex min-h-full min-w-full flex-col', paddingLeft)}
        >
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
