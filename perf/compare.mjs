// 두 측정 결과의 summary.json 을 나란히 놓고 차이를 찍는다.
//   node perf/compare.mjs perf/.output/<A> perf/.output/<B>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error('usage: node compare.mjs <dirA> <dirB>');
  process.exit(2);
}
const load = (d) => JSON.parse(readFileSync(join(d, 'summary.json'), 'utf8'));
const A = load(a);
const B = load(b);
const key = (r) => `${r.formFactor} ${r.url}`;
const byKey = new Map(A.map((r) => [key(r), r]));

const delta = (x, y, unit = '') => {
  const d = y - x;
  const s = d > 0 ? `+${d}` : `${d}`;
  return `${x}${unit} → ${y}${unit} (${s})`;
};
console.log(`A = ${a}\nB = ${b}\n`);
for (const r of B) {
  const p = byKey.get(key(r));
  if (!p) continue;
  console.log(`${r.formFactor.padEnd(8)} ${r.url}`);
  console.log(
    `  perf ${delta(p.performance, r.performance)}   LCP ${delta(p.lcpMs, r.lcpMs, 'ms')}   TBT ${delta(p.tbtMs, r.tbtMs, 'ms')}   CLS ${delta(p.cls, r.cls)}   KB ${delta(p.totalKB, r.totalKB)}`,
  );
}
