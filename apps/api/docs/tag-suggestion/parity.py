"""코틀린 추론이 여기 학습과 같은 점수를 내는지 지킬 고정 사례를 만든다.

    python3 parity.py notices.tsv

산출물은 src/test/resources/model/tag-suggestion-parity.json. 모델을 다시 만들었으면 이것도 다시 만든다.
채점은 학습 코드가 아니라 **내보낸 모델 파일**로 한다 — 코틀린이 맞춰야 할 대상이 그 파일이다.
"""
import csv, json, math, random, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL = ROOT / "src/main/resources/model/notice-tag-suggestion.json"
OUT = ROOT / "src/test/resources/model/tag-suggestion-parity.json"
BODY_CHARS = 900
SAMPLE = 40


def ngrams(text, lo, hi):
    grams = []
    for word in text.lower().split():
        w = f" {word} "
        for n in range(lo, hi + 1):
            offset = 0
            grams.append(w[offset:offset + n])
            while offset + n < len(w):
                offset += 1
                grams.append(w[offset:offset + n])
            if offset == 0:
                break
    return grams


def score(model, text):
    counts = {}
    for gram in ngrams(text, model["ngramMin"], model["ngramMax"]):
        i = model["vocabulary"].get(gram)
        if i is not None:
            counts[i] = counts.get(i, 0) + 1
    weights = {i: (1 + math.log(c)) * model["idf"][i] for i, c in counts.items()}
    norm = math.sqrt(sum(x * x for x in weights.values())) or 1.0
    weights = {i: x / norm for i, x in weights.items()}
    return {
        t["name"]: 1 / (1 + math.exp(-(t["intercept"] + sum(t["coef"][i] * x for i, x in weights.items()))))
        for t in model["tags"]
    }


def main(path):
    model = json.loads(MODEL.read_text())
    rows = [r for r in csv.reader(open(path), delimiter="\t") if len(r) >= 5]
    random.seed(7)
    cases = []
    for r in random.sample(rows, SAMPLE):
        body = r[4][:BODY_CHARS]
        cases.append({
            "id": r[0], "title": r[3], "plainBody": body,
            "scores": {k: round(v, 9) for k, v in score(model, f"{r[3]} {body}").items()},
        })
    OUT.write_text(json.dumps(cases, ensure_ascii=False, indent=1))
    print(f"{OUT} 고정 사례 {len(cases)}건")


if __name__ == "__main__":
    main(sys.argv[1])
