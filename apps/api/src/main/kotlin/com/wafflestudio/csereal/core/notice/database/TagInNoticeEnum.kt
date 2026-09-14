package com.wafflestudio.csereal.core.notice.database

import com.wafflestudio.csereal.common.CserealException
import com.wafflestudio.csereal.common.ErrorCode

/**
 * 공지 태그. `krName` 이 API·프론트가 주고받는 문자열이고, `guide` 는 무엇을 붙일지의 기준이다.
 *
 * 기준을 적어두는 이유: 없으면 같은 성격의 공지가 갈린다. 실제로 내부·외부행사가 동시에 붙은
 * 공지가 70건, `수업` 과 학부 태그가 겹친 공지가 954건 있었다(2026-09 prod 집계).
 *
 * `학부`·`대학원` 은 **대상 표지**지 주제가 아니다. 장학·채용·행사 공지에도 대상이 그 과정이면 붙인다.
 * 이름이 `학사(학부)` 였을 땐 주제로 오해돼 실제 용법과 어긋났다(2022-09~ 전수조사 3,524건).
 * 둘은 배타적이지 않아 수강신청·강의평가·계절수업·학점교류처럼 양쪽을 명시하면 둘 다 붙인다.
 * 학생을 특정하지 않는 전 구성원 안내엔 붙이지 않는다 — 안 그러면 거의 모든 공지에 붙어 필터가 죽는다.
 */
enum class TagInNoticeEnum(val krName: String, val guide: String) {
    SCHOLARSHIP("장학", "장학금 선발·신청"),
    UNDERGRADUATE("학부", "대상이 학부생일 때. 주제가 학사인지와 무관하다"),
    GRADUATE("대학원", "대상이 대학원생일 때"),
    MINOR("다전공/전과", "다전공·부전공·전과"),
    ADMISSIONS("입학", "학부·대학원 입시"),
    GRADUATIONS("졸업", "졸업 요건·학위수여"),
    RECRUIT("채용정보", "기업·기관 채용. 채용설명회·박람회도 여기 포함한다"),
    STUDENT_EXCHANGE("교환학생/유학", "내국인이 해외로 나가는 것 — 교환학생·파견·해외 장학·국비유학"),
    INNER_EVENTS_PROGRAMS("내부행사/프로그램", "컴퓨터공학부 또는 서울대학교가 주최"),
    OUTER_EVENTS_PROGRAMS("외부행사/프로그램", "그 밖의 기관이 주최"),
    INTERNATIONAL("international", "외국인 학생 대상. 내국인의 해외 진출은 교환학생/유학이다"),
    CONTESTS("공모전/대회", "공모전·경진대회·해커톤. 채용연계형이어도 채용정보와 함께 붙인다"),
    CAMPUS_LIFE("시설/생활", "셔틀버스·건물 통제·사물함·생활관 등 교내 시설과 생활 안내");

    companion object {
        private val lookupMap: Map<String, TagInNoticeEnum> = entries.associateBy(TagInNoticeEnum::krName)

        fun getTagEnum(t: String): TagInNoticeEnum {
            return lookupMap[t] ?: throw CserealException(ErrorCode.NOTICE_TAG_NOT_FOUND, mapOf("t" to t))
        }
    }
}
