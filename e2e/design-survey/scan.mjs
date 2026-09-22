// 정적 목록은 실제 렌더 빈도가 아니다. TS 문자열/템플릿 조각에서 완전한 utility 후보만 센다.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = `${root}apps/web/src/`;
const output = `${root}docs/design-system/measurements/`;
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory() ? walk(`${dir}${e.name}/`) : `${dir}${e.name}`,
    ),
  );
  return nested.flat().sort();
}
const files = (await walk(source)).filter(
  (f) =>
    /\.(ts|tsx)$/.test(f) &&
    !f.endsWith('routeTree.gen.ts') &&
    !f.includes('/types/'),
);
const groups = {
  color:
    /^(?:bg|text|border|fill|stroke|ring)-(?:neutral-\d+|main-orange(?:-dark)?|link|white|black|transparent|(?:red|green|blue|yellow|orange|gray|slate)-\d+|\[(?:#|rgb|hsl)[^\]]+\])(?:\/\d+)?$/,
  typography:
    /^(?:text-(?:xs|sm|md|base|lg|xl|[2-9]xl|\[[\d.]+(?:px|rem)\])|font-(?:normal|medium|semibold|bold|\[[^\]]+\])|leading-[\w.[\]-]+|tracking-[\w.[\]-]+)$/,
  spacing:
    /^-?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-(?:[\d.]+|\[[^\]]+\])$/,
  shape: /^(?:rounded(?:-[tblrse]{1,2})?|shadow|border)-(?:[\w.]+|\[[^\]]+\])$/,
  motion: /^(?:duration|animate|transition|ease)-[\w[\].-]+$/,
};
const utilities = new Map();
const lucide = new Map();
const svgImports = [];
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const ast = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const relative = file.slice(root.length);
  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      const mod = node.moduleSpecifier.text;
      if (mod === 'lucide-react' && !node.importClause?.isTypeOnly)
        for (const el of node.importClause?.namedBindings?.elements ?? []) {
          if (el.isTypeOnly) continue;
          const name = el.propertyName?.text ?? el.name.text;
          const uses = lucide.get(name) ?? [];
          uses.push(relative);
          lucide.set(name, uses);
        }
      if (/\.svg(?:\?|$)/.test(mod))
        svgImports.push({ file: relative, module: mod });
    }
    if (
      ts.isStringLiteralLike(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      for (const word of node.text.split(/\s+/)) {
        const utility = word.split(/:(?![^[]*\])/).at(-1);
        const group = Object.entries(groups).find(([, pattern]) =>
          pattern.test(utility),
        )?.[0];
        if (!group) continue;
        const entry = utilities.get(word) ?? {
          group,
          utility: word,
          count: 0,
          files: new Set(),
          examples: [],
        };
        entry.count++;
        entry.files.add(relative);
        if (entry.examples.length < 3)
          entry.examples.push(
            `${relative}:${ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1}`,
          );
        utilities.set(word, entry);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}
const entries = [...utilities.values()].map(({ files, ...item }) => ({
  ...item,
  fileCount: files.size,
}));
const summary = Object.fromEntries(
  Object.keys(groups).map((group) => {
    const list = entries
      .filter((e) => e.group === group)
      .sort((a, b) => b.count - a.count || a.utility.localeCompare(b.utility));
    return [
      group,
      {
        uniqueCandidates: list.length,
        occurrences: list.reduce((sum, e) => sum + e.count, 0),
        top: list.slice(0, 30),
      },
    ];
  }),
);
await mkdir(output, { recursive: true });
await writeFile(
  `${output}static.json`,
  `${JSON.stringify(
    {
      sourceBase: 'd1baf83c',
      scannedFiles: files.length,
      method:
        'TS AST string/template fragments; excludes generated route tree and types. Counts declarations, not rendered instances. Dynamic class fragments, CSS, SVG and third-party styles are not utility counts. Top 30 per category; color literals and CSS inspected separately.',
      groups: summary,
      lucide: {
        icons: lucide.size,
        importOccurrences: [...lucide.values()].reduce(
          (n, fs) => n + fs.length,
          0,
        ),
        files: new Set([...lucide.values()].flat()).size,
        names: [...lucide.keys()].sort(),
      },
      svgImports,
    },
    null,
    2,
  )}\n`,
);
console.log(
  JSON.stringify(
    {
      scannedFiles: files.length,
      groups: Object.fromEntries(
        Object.entries(summary).map(([k, v]) => [
          k,
          { unique: v.uniqueCandidates, occurrences: v.occurrences },
        ]),
      ),
      lucideIcons: lucide.size,
      svgImports: svgImports.length,
    },
    null,
    2,
  ),
);

// 불투명한 단색의 텍스트/배경 조합만 계산한다. 비활성·이미지·그라데이션은 별도 판단.
const css = await readFile(`${source}app.css`, 'utf8');
const palette = Object.fromEntries(
  [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [
    m[1],
    m[2],
  ]),
);
const luminance = (hex) => {
  const rgb = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
const pairs = [
  ['primary / filled tag', 'white', 'main-orange'],
  ['outline tag', 'main-orange', 'white'],
  ['secondary text', 'neutral-400', 'white'],
  ['placeholder', 'neutral-300', 'white'],
  ['muted text', 'neutral-500', 'white'],
  ['secondary button', 'neutral-500', 'neutral-100'],
  ['text link', 'link', 'white'],
  ['neutral button', 'white', 'neutral-700'],
  ['neutral button hover', 'white', 'neutral-500'],
];
await writeFile(
  `${output}contrast.json`,
  `${JSON.stringify(
    {
      sourceBase: 'd1baf83c',
      method:
        'sRGB relative luminance; (lighter + .05) / (darker + .05). Opaque color pairs only. Values loaded from app.css. AA normal-text threshold 4.5; compare unrounded ratio.',
      reference:
        'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
      pairs: pairs.map(([role, foreground, background]) => {
        const [lighter, darker] = [
          luminance(palette[foreground]),
          luminance(palette[background]),
        ].sort((a, b) => b - a);
        const ratio = (lighter + 0.05) / (darker + 0.05);
        return {
          role,
          foreground: palette[foreground],
          background: palette[background],
          ratio,
          meetsNormalTextAA: ratio >= 4.5,
        };
      }),
    },
    null,
    2,
  )}\n`,
);
