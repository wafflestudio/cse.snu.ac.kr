// lhci filesystem 업로드 결과(manifest.json)에서 대표(중앙값) 런을 골라 표로 찍고
// summary.json 으로 남긴다(compare.mjs 가 읽는다).
//   node summarize.mjs <결과 디렉터리>   (mobile/, desktop/ 하위를 읽는다)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node summarize.mjs <dir>');
  process.exit(2);
}

const rows = [];
for (const ff of ['mobile', 'desktop']) {
  const manifestPath = join(dir, ff, 'manifest.json');
  if (!existsSync(manifestPath)) continue;
  for (const run of JSON.parse(readFileSync(manifestPath, 'utf8'))) {
    if (!run.isRepresentativeRun) continue;
    // manifest 의 경로는 컨테이너 안 절대경로(/work/…)라 호스트에서도 읽히게 파일명만 쓴다.
    const lhr = JSON.parse(
      readFileSync(join(dir, ff, basename(run.jsonPath)), 'utf8'),
    );
    const a = lhr.audits;
    rows.push({
      url: decodeURI(new URL(run.url).pathname + new URL(run.url).search),
      formFactor: ff,
      performance: Math.round(run.summary.performance * 100),
      accessibility: Math.round(run.summary.accessibility * 100),
      bestPractices: Math.round(run.summary['best-practices'] * 100),
      seo: Math.round(run.summary.seo * 100),
      lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
      tbtMs: Math.round(a['total-blocking-time'].numericValue),
      cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
      speedIndexMs: Math.round(a['speed-index'].numericValue),
      totalKB: Math.round(a['total-byte-weight'].numericValue / 1024),
    });
  }
}

writeFileSync(join(dir, 'summary.json'), JSON.stringify(rows, null, 2));

const pad = (v, n) => String(v).padStart(n);
for (const ff of ['mobile', 'desktop']) {
  const list = rows.filter((r) => r.formFactor === ff);
  if (!list.length) continue;
  console.log(
    `\n[${ff}]  perf a11y  bp  seo   LCP(ms)  TBT(ms)    CLS   SI(ms)    KB  url`,
  );
  for (const r of list) {
    console.log(
      `${pad(r.performance, 11)} ${pad(r.accessibility, 4)} ${pad(r.bestPractices, 3)} ${pad(r.seo, 4)} ${pad(r.lcpMs, 9)} ${pad(r.tbtMs, 8)} ${pad(r.cls, 6)} ${pad(r.speedIndexMs, 8)} ${pad(r.totalKB, 5)}  ${r.url}`,
    );
  }
}
console.log(
  `\n리포트: ${dir}/{mobile,desktop}/*.html · 요약: ${dir}/summary.json`,
);
