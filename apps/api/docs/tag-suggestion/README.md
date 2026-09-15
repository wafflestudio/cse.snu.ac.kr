# 공지 태그 제안 모델

`src/main/resources/model/notice-tag-suggestion.json` 을 만드는 곳. 백엔드는 이 파일만 읽는다
(`core/notice/suggest/TagSuggester`).

```
./dump.sh > notices.tsv
python3 train.py notices.tsv
./gradlew test --tests '*TagSuggesterTest*'
```

## 왜 이런 모양인가

- **TF-IDF char_wb + 로지스틱 회귀.** 형태소 분석기 없이 한국어를 다루려고 글자 n-gram 을 쓴다.
  모델이 몇 MB 에 추론이 1ms 미만이라 운영 서버(Xeon 8코어·GPU 없음, Elasticsearch·MySQL 과 공유)
  안에서 그냥 돈다. 같은 데이터로 4B 경량 LLM 을 붙여 비교했을 때 정밀도가 오히려 낮았다
  (내부행사 0.88 대 0.41, international 0.75 대 0.17).
- **태그마다 임계값이 다르다.** 정밀도 0.90 을 목표로 잡았다 — 틀린 제안을 자주 내면 사람이 제안을
  안 보게 된다. 임계값은 제목 시리즈를 그룹으로 묶은 out-of-fold 확률에서 구한다. 안 묶으면
  회차만 다른 반복 공지가 학습·평가에 나눠 들어가 수치가 부풀려진다.
- **`다전공/전과` 만 규칙이다.** 양성 표본이 52건뿐이라 모델 재현율이 0.06 이었다. 제목에
  다전공·부전공·복수전공·전과 가 있는지 보는 규칙이 정밀도 1.00 / 재현율 0.90 으로 훨씬 낫다.

## 함정

- **본문은 `plain_text_description` 이다.** 서빙 때 `cleanTextFromHtml` 이 만드는 문자열과 같아야 한다.
  원본 HTML 로 학습하면 자질이 통째로 달라진다.
- **`BODY_CHARS`·n-gram 범위를 바꾸면 `TagSuggester` 의 상수도 같이 바꾼다.** 어긋나도 아무 데서도
  안 터지고 점수만 조용히 달라진다. `TagSuggesterTest` 의 고정 사례가 그걸 잡는다 —
  모델을 다시 만들었으면 고정 사례도 다시 만들어야 한다(`parity.py`).
