package com.wafflestudio.csereal.core.notice.suggest

import com.fasterxml.jackson.databind.ObjectMapper
import com.wafflestudio.csereal.common.utils.cleanTextFromHtml
import com.wafflestudio.csereal.core.notice.database.TagInNoticeEnum
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import kotlin.math.exp
import kotlin.math.ln

/**
 * 제목·본문으로 공지 태그를 제안한다. 붙이는 건 사람이 하고 이건 후보만 낸다.
 *
 * ⚠️ 여기 계산은 scikit-learn 의 vectorizer 를 옮긴 것이다. 한 군데라도 어긋나면 점수가 조용히
 * 달라져 임계값이 무의미해진다 — 고칠 일이 생기면 `TagSuggesterParityTest` 를 같이 본다.
 */
@Component
class TagSuggester(objectMapper: ObjectMapper) {
    private val model: TagSuggestionModel by lazy {
        ClassPathResource(MODEL_PATH).inputStream.use {
            objectMapper.readValue(it, TagSuggestionModel::class.java)
        }
    }

    fun suggest(title: String, descriptionHtml: String): List<TagSuggestion> {
        val scores = score(title, cleanTextFromHtml(descriptionHtml))
        return model.tags.mapNotNull { tag ->
            val confidence = scores.getValue(tag.name)
            val byRule = tag.titleRegex?.containsMatchIn(title) == true
            if (confidence < tag.threshold && !byRule) {
                null
            } else {
                TagSuggestion(TagInNoticeEnum.valueOf(tag.name).krName, confidence)
            }
        }.sortedByDescending { it.confidence }
    }

    /** 태그 이름 → 확률. 본문은 학습 때와 같게 자른다 — 길이를 바꾸면 tf 가 달라져 점수가 어긋난다. */
    fun score(title: String, plainBody: String): Map<String, Double> {
        val x = vectorize("$title ${plainBody.takeCodePoints(BODY_CHARS)}")
        return model.tags.associate { tag ->
            tag.name to sigmoid(tag.intercept + x.entries.sumOf { (i, w) -> tag.coef[i] * w })
        }
    }

    /** 어휘에 있는 n-gram 만 남긴 L2 정규화 tf-idf 벡터. 키는 어휘 인덱스. */
    private fun vectorize(text: String): Map<Int, Double> {
        val counts = HashMap<Int, Int>()
        for (gram in charWbNgrams(text.lowercase())) {
            model.vocabulary[gram]?.let { counts.merge(it, 1, Int::plus) }
        }
        // sublinear_tf=True → 1+ln(tf), 그다음 idf, 마지막에 l2. 순서가 sklearn 과 같아야 한다.
        val weights = counts.mapValues { (i, c) -> (1 + ln(c.toDouble())) * model.idf[i] }
        val norm = kotlin.math.sqrt(weights.values.sumOf { it * it })
        return if (norm == 0.0) emptyMap() else weights.mapValues { it.value / norm }
    }

    /**
     * sklearn `analyzer='char_wb'` 와 같은 n-gram. 낱말마다 앞뒤에 공백을 붙여 낱말 경계를
     * 자질로 쓰고, 낱말이 n 보다 짧으면 그 n 은 한 번만 센다.
     *
     * 글자 수는 코드포인트로 센다 — 파이썬 문자열이 그렇다. UTF-16 단위로 세면 이모지가 든
     * 공지에서만 n-gram 이 어긋나 점수가 조용히 달라진다(실제로 공지 25457 에서 잡혔다).
     */
    private fun charWbNgrams(text: String): List<String> {
        val grams = mutableListOf<String>()
        for (word in text.split(WHITESPACE)) {
            if (word.isEmpty()) continue
            val w = " $word ".codePoints().toArray()
            for (n in model.ngramMin..model.ngramMax) {
                var offset = 0
                grams.add(String(w, 0, minOf(n, w.size)))
                while (offset + n < w.size) {
                    offset++
                    grams.add(String(w, offset, minOf(n, w.size - offset)))
                }
                if (offset == 0) break
            }
        }
        return grams
    }

    private fun String.takeCodePoints(n: Int): String {
        if (length <= n) return this
        val count = codePointCount(0, length)
        return if (count <= n) this else substring(0, offsetByCodePoints(0, n))
    }

    private fun sigmoid(z: Double) = 1 / (1 + exp(-z))

    companion object {
        private const val MODEL_PATH = "model/notice-tag-suggestion.json"
        private const val BODY_CHARS = 900

        // 파이썬 str.split() 이 나누는 문자 집합. Java 의 isWhitespace 는 NBSP 를 공백으로 안 봐서
        // 그것만 쓰면 HTML 에서 흔한 &nbsp; 가 낱말을 붙여버린다.
        private val WHITESPACE = Regex(
            "[\\s\\u001c-\\u001f\\u0085\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000]+"
        )
    }
}
