package com.wafflestudio.csereal.core.notice.database

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.wafflestudio.csereal.common.utils.FixedPageRequest
import com.wafflestudio.csereal.core.main.dto.MainImportantResponse
import com.wafflestudio.csereal.core.notice.database.QNoticeEntity.noticeEntity
import com.wafflestudio.csereal.core.notice.database.QNoticeTagEntity.noticeTagEntity
import com.wafflestudio.csereal.core.notice.dto.NoticeSearchDto
import com.wafflestudio.csereal.core.notice.dto.NoticeSearchResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.LocalDate

interface NoticeRepository : JpaRepository<NoticeEntity, Long>, CustomNoticeRepository {
    /** 조회수 +1. 엔티티로 읽어 올리면 동시 요청이 서로 덮어써서 DB 에서 증가시킨다. */
    @Modifying
    @Query("UPDATE notice e SET e.viewCount = e.viewCount + 1 WHERE e.id = :id AND e.isPrivate = false")
    fun increaseViewCount(@Param("id") id: Long): Int

    fun findFirstByIsPrivateFalseAndCreatedAtLessThanOrderByCreatedAtDesc(
        timestamp: LocalDateTime
    ): NoticeEntity?

    fun findFirstByIsPrivateFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(
        timestamp: LocalDateTime
    ): NoticeEntity?

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        """
        UPDATE notice n 
        SET n.isPinned = false, n.pinnedUntil = null 
        WHERE n.isPinned = true AND n.pinnedUntil < :currentDate
    """
    )
    fun updateExpiredPinnedStatus(@Param("currentDate") currentDate: LocalDate): Int

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        """
        UPDATE notice n 
        SET n.isImportant = false, n.importantUntil = null 
        WHERE n.isImportant = true AND n.importantUntil < :currentDate
    """
    )
    fun updateExpiredImportantStatus(@Param("currentDate") currentDate: LocalDate): Int
}

interface CustomNoticeRepository {
    /**
     * 공지 목록. 순서·페이징까지 여기서 정한다. keyword 는 제목에 글자 그대로 든 낱말로 찾는다(띄어 쓴 낱말은 모두).
     * 목록이 제목만 보여 주니 걸린 이유가 늘 보이게 하고, '네이'로 '네이버'도 찾게 한다(검색 색인은 낱말 단위라 못 찾는다).
     * 본문 검색은 통합검색 몫이다. 행정실 2026-10-23 "공지 검색이 이상하다".
     */
    fun browseNotice(
        tag: List<String>?,
        excludeTag: List<String>?,
        keyword: String?,
        pageable: Pageable,
        usePageBtn: Boolean,
        isStaff: Boolean
    ): NoticeSearchResponse

    fun findImportantNotice(cnt: Int? = null): List<MainImportantResponse>
}

@Component
class NoticeRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : CustomNoticeRepository {
    override fun browseNotice(
        tag: List<String>?,
        excludeTag: List<String>?,
        keyword: String?,
        pageable: Pageable,
        usePageBtn: Boolean,
        isStaff: Boolean
    ): NoticeSearchResponse {
        val tagsBooleanBuilder = BooleanBuilder()
        val isPrivateBooleanBuilder = BooleanBuilder()
        val excludeBooleanBuilder = BooleanBuilder()
        val titleBooleanBuilder = BooleanBuilder()

        keyword?.trim()?.split(Regex("\\s+"))?.filter { it.isNotEmpty() }?.forEach {
            titleBooleanBuilder.and(noticeEntity.title.containsIgnoreCase(it))
        }

        if (!excludeTag.isNullOrEmpty()) {
            // 목록 쿼리의 조인과 별칭이 겹치면 "그 태그 줄만" 빠지고 글은 다른 태그 줄로 남는다.
            val excluded = QNoticeTagEntity("excludedTag")
            excludeBooleanBuilder.and(
                JPAExpressions.selectOne().from(excluded).where(
                    excluded.notice.eq(noticeEntity),
                    excluded.tag.name.`in`(excludeTag.map { TagInNoticeEnum.getTagEnum(it) })
                ).notExists()
            )
        }

        if (!tag.isNullOrEmpty()) {
            tag.forEach {
                val tagEnum = TagInNoticeEnum.getTagEnum(it)
                tagsBooleanBuilder.or(
                    noticeTagEntity.tag.name.eq(tagEnum)
                )
            }
        }

        if (!isStaff) {
            isPrivateBooleanBuilder.or(
                noticeEntity.isPrivate.eq(false)
            )
        }

        val jpaQuery = selectNoticeSearchDto()
            .leftJoin(noticeTagEntity).on(noticeTagEntity.notice.eq(noticeEntity))
            .where(tagsBooleanBuilder, isPrivateBooleanBuilder, excludeBooleanBuilder, titleBooleanBuilder)

        val total: Long
        var pageRequest = pageable

        if (usePageBtn) {
            val countQuery = jpaQuery.clone()
            total = countQuery.select(noticeEntity.countDistinct()).fetchOne()!!
            pageRequest = FixedPageRequest(pageable, total)
        } else {
            total = (10 * pageable.pageSize).toLong() + 1 // 10개 페이지 고정
        }

        val noticeSearchDtoList = jpaQuery
            .offset(pageRequest.offset)
            .limit(pageRequest.pageSize.toLong())
            .distinct()
            .orderBy(noticeEntity.isPinned.desc())
            .orderBy(noticeEntity.createdAt.desc())
            .fetch()

        return NoticeSearchResponse(total, noticeSearchDtoList)
    }

    private fun selectNoticeSearchDto() = queryFactory.select(
        Projections.constructor(
            NoticeSearchDto::class.java,
            noticeEntity.id,
            noticeEntity.title,
            noticeEntity.createdAt,
            noticeEntity.isPinned,
            noticeEntity.attachments.isNotEmpty,
            noticeEntity.isPrivate,
            noticeEntity.viewCount
        )
    ).from(noticeEntity)

    override fun findImportantNotice(cnt: Int?): List<MainImportantResponse> =
        queryFactory.select(
            Projections.constructor(
                MainImportantResponse::class.java,
                noticeEntity.id,
                noticeEntity.titleForMain,
                noticeEntity.title,
                noticeEntity.plainTextDescription,
                noticeEntity.createdAt,
                Expressions.constant("notice")
            )
        ).from(noticeEntity)
            .where(
                noticeEntity.isImportant.isTrue(),
                noticeEntity.isPrivate.isFalse()
            ).orderBy(
                noticeEntity.createdAt.desc()
            ).let {
                if (cnt != null) {
                    it.limit(cnt.toLong())
                } else {
                    it
                }
            }
            .fetch()
}
