package com.wafflestudio.csereal.core.notice.suggest

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.assertions.withClue
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.doubles.shouldBeLessThan
import io.kotest.matchers.shouldBe
import kotlin.math.abs

/**
 * 제안 점수가 학습 쪽(scikit-learn)과 같은 값인지 지킨다.
 *
 * 같은 모델 파일을 써도 vectorizer 를 한 글자라도 다르게 옮기면 점수가 조용히 달라지고,
 * 정밀도 0.90 에 맞춰 잡은 태그별 임계값이 의미를 잃는다. 고정 사례는 운영 공지 40건을
 * 파이썬으로 채점해 박아둔 것이다(`docs/tag-suggestion/`).
 */
class TagSuggesterTest : BehaviorSpec({
    val mapper: ObjectMapper = jacksonObjectMapper()
    val suggester = TagSuggester(mapper)

    data class Case(
        val id: String,
        val title: String,
        val plainBody: String,
        val scores: Map<String, Double>
    )

    val cases: List<Case> = mapper.readValue(
        checkNotNull(TagSuggesterTest::class.java.getResourceAsStream("/model/tag-suggestion-parity.json"))
    )

    Given("파이썬으로 채점해둔 운영 공지 ${cases.size}건") {
        When("코틀린으로 다시 채점하면") {
            Then("태그마다 1e-6 안에서 같다") {
                cases.forEach { case ->
                    val got = suggester.score(case.title, case.plainBody)
                    case.scores.forEach { (tag, expected) ->
                        withClue("공지 ${case.id} / $tag") {
                            abs(got.getValue(tag) - expected) shouldBeLessThan 1e-6
                        }
                    }
                }
            }
        }
    }

    Given("HTML 본문") {
        When("제안을 받으면") {
            Then("태그를 벗겨낸 평문과 같은 결과가 나온다") {
                val title = "2026학년도 겨울 계절수업 수강신청 안내"
                val body = "수강신청 기간과 방법을 안내합니다."
                suggester.suggest(title, "<p>수강신청 <b>기간</b>과 방법을 안내합니다.</p>") shouldBe
                    suggester.suggest(title, body)
            }
        }
    }

    Given("제목 규칙이 있는 태그") {
        When("제목에 '다전공' 이 있으면") {
            Then("모델 점수와 무관하게 제안한다") {
                val suggestions = suggester.suggest("2026학년도 다전공 신청 안내", "<p>신청 기간을 안내합니다.</p>")
                suggestions.map { it.tag } shouldContain "다전공/전과"
            }
        }
    }
})
