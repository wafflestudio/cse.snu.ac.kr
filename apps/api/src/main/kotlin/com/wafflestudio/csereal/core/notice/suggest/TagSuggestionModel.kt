package com.wafflestudio.csereal.core.notice.suggest

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

/**
 * 학습해서 내보낸 태그 제안 모델. 생성은 `docs/tag-suggestion/train.py`.
 *
 * scikit-learn 의 `TfidfVectorizer(analyzer='char_wb', ngram_range=(2,4), sublinear_tf=True)` +
 * `LogisticRegression` 을 그대로 옮긴 것이라, [TagSuggester] 의 계산은 그 구현과 글자 단위로 같아야 한다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TagSuggestionModel(
    val version: Int,
    val ngramMin: Int,
    val ngramMax: Int,
    val vocabulary: Map<String, Int>,
    val idf: DoubleArray,
    val tags: List<Tag>
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Tag(
        /** [com.wafflestudio.csereal.core.notice.database.TagInNoticeEnum] 의 이름. */
        val name: String,
        val intercept: Double,
        /** 이 값 이상이면 제안한다. 학습 때 정밀도 0.90 을 맞추도록 태그마다 따로 잡았다. */
        val threshold: Double,
        val coef: DoubleArray,
        /** 모델로는 정밀도를 못 맞추는 태그의 대안. 제목이 걸리면 점수와 무관하게 제안한다. */
        val titlePattern: String? = null
    ) {
        val titleRegex: Regex? by lazy { titlePattern?.let { Regex(it) } }

        override fun equals(other: Any?) = this === other
        override fun hashCode() = System.identityHashCode(this)
    }

    override fun equals(other: Any?) = this === other
    override fun hashCode() = System.identityHashCode(this)
}
