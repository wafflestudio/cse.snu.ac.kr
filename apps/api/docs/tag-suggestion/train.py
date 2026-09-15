"""공지 태그 제안 모델을 만든다. 산출물은 src/main/resources/model/notice-tag-suggestion.json.

    python3 train.py notices.tsv

입력 TSV 는 헤더 없이 `id \t 작성일 \t 태그(| 구분) \t 제목 \t 본문` 이다. dump.sh 가 만든다.
본문은 plain_text_description 이어야 한다 — 서빙할 때 백엔드가 cleanTextFromHtml 로 만드는 것과
같은 문자열이라야 자질이 어긋나지 않는다.
"""
import csv, json, re, sys
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_curve
from sklearn.model_selection import GroupKFold

TAGS = [
    "RECRUIT", "SCHOLARSHIP", "UNDERGRADUATE", "GRADUATE", "OUTER_EVENTS_PROGRAMS",
    "INNER_EVENTS_PROGRAMS", "STUDENT_EXCHANGE", "GRADUATIONS", "ADMISSIONS",
    "MINOR", "INTERNATIONAL", "CONTESTS", "CAMPUS_LIFE",
]
# 모델로는 정밀도 0.90 을 못 맞추는 태그(전수조사 기준 재현율 0.06). 제목 규칙이 P=1.00 R=0.90 이라 그쪽에 맡긴다.
TITLE_RULES = {"MINOR": "다전공|부전공|복수전공|전과"}

BODY_CHARS = 900          # 백엔드 TagSuggester.BODY_CHARS 와 같아야 한다
MAX_FEATURES = 20000      # 10k~50k 사이 품질 차가 없어 가운데로 잡았다
TARGET_PRECISION = 0.90

OUT = Path(__file__).resolve().parents[2] / "src/main/resources/model/notice-tag-suggestion.json"


def series_key(title):
    """반복 공지를 한 덩어리로 묶는 키. 회차·날짜만 다른 같은 공지가 학습·평가에 갈라져 들어가면
    out-of-fold 확률이 부풀려지고, 그 위에서 잡은 임계값은 운영에서 정밀도를 못 낸다."""
    t = re.sub(r"\[[^\]]*\d[^\]]*\]", "", title)
    t = re.sub(r"\([^)]*\)", "", t)
    t = re.sub(r"\d+", "", t)
    t = re.sub(r"(학년도|학기|년|월|일|차|기|수정|재공지|안내|알림|공지)", "", t)
    return re.sub(r"[^\w가-힣]", "", t)


def main(path):
    rows = [r for r in csv.reader(open(path), delimiter="\t") if len(r) >= 5]
    texts = [f"{r[3]} {r[4][:BODY_CHARS]}" for r in rows]
    labels = [set(t for t in r[2].split("|") if t) for r in rows]
    keys = {}
    groups = np.array([keys.setdefault(series_key(r[3]) or f"__{r[0]}", len(keys)) for r in rows])

    vec = TfidfVectorizer(
        analyzer="char_wb", ngram_range=(2, 4), min_df=2,
        max_features=MAX_FEATURES, sublinear_tf=True,
    )
    matrix = vec.fit_transform(texts)
    print(f"{len(rows)}건 / 시리즈 {len(keys)}개 / 어휘 {matrix.shape[1]}")

    model = {
        "version": 1, "ngramMin": 2, "ngramMax": 4,
        "idf": [round(float(x), 6) for x in vec.idf_],
        "vocabulary": {k: int(i) for k, i in vec.vocabulary_.items()},
        "tags": [],
    }
    print(f"\n{'태그':<24}{'양성':>6}{'임계값':>8}{'R@P90':>8}")
    print("─" * 46)
    for tag in TAGS:
        y = np.array([1 if tag in lab else 0 for lab in labels])
        oof = np.zeros(len(y))
        for tr, te in GroupKFold(5).split(matrix, y, groups):
            fold = LogisticRegression(max_iter=4000, C=4, class_weight="balanced").fit(matrix[tr], y[tr])
            oof[te] = fold.predict_proba(matrix[te])[:, 1]
        prec, rec, thr = precision_recall_curve(y, oof)
        good = prec[:-1] >= TARGET_PRECISION
        if tag in TITLE_RULES or not good.any():
            threshold, recall = 1.1, 0.0     # 1.1 = 모델로는 절대 안 뜬다
        else:
            i = int(np.argmax(rec[:-1] * good))
            threshold, recall = float(thr[i]), float(rec[i])
        final = LogisticRegression(max_iter=4000, C=4, class_weight="balanced").fit(matrix, y)
        entry = {
            "name": tag,
            "intercept": round(float(final.intercept_[0]), 6),
            "threshold": round(threshold, 4),
            "coef": [round(float(x), 5) for x in final.coef_[0]],
        }
        if tag in TITLE_RULES:
            entry["titlePattern"] = TITLE_RULES[tag]
        model["tags"].append(entry)
        print(f"{tag:<24}{int(y.sum()):>6}{threshold:>8.3f}{recall:>8.2f}")

    OUT.write_text(json.dumps(model, ensure_ascii=False, separators=(",", ":")))
    print(f"\n{OUT} {OUT.stat().st_size / 1e6:.2f} MB")


if __name__ == "__main__":
    main(sys.argv[1])
