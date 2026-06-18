// 라우트 파일을 createFileRoute로 감싼다(파일기반 컷오버).
// 컴포넌트 시그니처는 그대로 두고 createFileRoute의 component 래퍼가 loaderData/params를
// prop으로 주입한다(원본 destructuring 파싱 불필요 → 견고). loader는 SSR 합성 request로 호출.
// ※ 반드시 1회만 실행(재실행 시 중복 래핑). cutover.sh가 깨끗한 상태에서 1회 호출.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync('find app/routes -name "*.tsx"', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => !/\/__root\.tsx$/.test(f))
  .filter((f) => !/\/(components|assets|sections)\//.test(f))
  .filter((f) => !/\/[A-Z][A-Za-z0-9]*\.tsx$/.test(f));

const DOT = '__LITERAL_DOT__';
function toRoutePath(file) {
  let rel = file.replace(/^app\/routes\//, '').replace(/\.tsx$/, '');
  rel = rel.replace(/\[\.\]/g, DOT).replace(/\[([^\]]*)\]/g, '$1');
  const segs = rel
    .split('/')
    .map((s) => (s === 'index' ? '' : s.split('.').join('/')));
  return `/${segs.join('/')}`.split(DOT).join('.').replace(/\/+/g, '/');
}

const flagged = [];
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const routePath = toRoutePath(file);
  const hasLoader = /export async function loader/.test(src);

  src = src.replace(/export async function loader/, 'async function loader');

  const compRe = /export default function (\w+)\s*\(([\s\S]*?)\)\s*\{/;
  const m = src.match(compRe);
  if (!m) {
    flagged.push(`${file}  ⚠ no default-function export`);
    continue;
  }
  const compName = m[1];
  const hasProps = m[2].trim().length > 0;
  src = src.replace(compRe, `function ${compName}(${m[2]}) {`);

  let header = `import { createFileRoute } from '@tanstack/react-router';\n`;
  if (hasLoader) header += `import { getLoaderRequest } from '@/lib/ssr';\n`;
  src = header + src;

  const loaderLine = hasLoader
    ? `  loader: (ctx) => loader({ request: getLoaderRequest(ctx.location.href), params: ctx.params }),\n`
    : '';
  // 컴포넌트 래퍼: prop 주입(시그니처 불변). props 없으면 직접 참조.
  let componentLine;
  if (!hasProps) {
    componentLine = `  component: ${compName},\n`;
  } else {
    const ld = hasLoader ? ' loaderData={Route.useLoaderData()}' : '';
    componentLine = `  component: () => <${compName}${ld} params={Route.useParams()} />,\n`;
  }
  src += `\nexport const Route = createFileRoute('${routePath}')({\n${loaderLine}${componentLine}});\n`;

  fs.writeFileSync(file, src);
}
console.log(`변환 ${files.length - flagged.length}/${files.length}`);
if (flagged.length) console.log('FLAGGED:\n' + flagged.join('\n'));
