package com.wafflestudio.csereal.core.notice.database

import com.wafflestudio.csereal.common.CserealException
import com.wafflestudio.csereal.common.ErrorCode

/**
 * 공지 태그. `krName` 이 API·프론트가 주고받는 문자열이고, `guide` 는 무엇을 붙일지의 기준이다.
 *
 * 기준을 적어두는 이유: 없으면 같은 성격의 공지가 갈린다. 실제로 내부·외부행사가 동시에 붙은
 * 공지가 70건, `수업` 과 `학사(학부)` 가 겹친 공지가 954건 있었다(2026-09 prod 집계).
 *
 * 학부·대학원은 배타적이지 않다. 수강신청·강의평가·수강소감·계절수업·학점교류·교과목 수요조사·
 * 창업학점제·전자출결은 본문이 "학부 및 대학원 강좌 전체"·"학사과정 2.7/대학원과정 3.3" 처럼
 * 양쪽을 명시하므로 둘 다 붙인다.
 */
enum class TagInNoticeEnum(val krName: String, val guide: String) {
    SCHOLARSHIP("장학", "장학금 선발·신청"),
    UNDERGRADUATE(
        "학사(학부)",
        "학부 학사. 학부 전용 표지(성적평가방법 선택제·정원 외 신청·학부생 TA·신입생·학번·교양)가 있을 때"
    ),
    GRADUATE("학사(대학원)", "대학원 학사. 대학원·석박사·특론이 명시될 때"),
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
