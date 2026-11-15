package com.wafflestudio.csereal.core.main.database

import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.wafflestudio.csereal.core.main.dto.MainNoticeResponse
import com.wafflestudio.csereal.core.main.dto.MainSlideResponse
import com.wafflestudio.csereal.core.news.database.QNewsEntity.newsEntity
import com.wafflestudio.csereal.core.notice.database.QNoticeEntity.noticeEntity
import com.wafflestudio.csereal.core.notice.database.QNoticeTagEntity
import com.wafflestudio.csereal.core.notice.database.QNoticeTagEntity.noticeTagEntity
import com.wafflestudio.csereal.core.notice.database.QTagInNoticeEntity.tagInNoticeEntity
import com.wafflestudio.csereal.core.notice.database.TagInNoticeEnum
import com.wafflestudio.csereal.core.resource.mainImage.service.MainImageService

import org.springframework.stereotype.Component

// TODO: Refactor to each repository (and service)
interface MainRepository {
    fun readMainSlide(): List<MainSlideResponse>
    fun readMainNoticeTotal(): List<MainNoticeResponse>
    fun readMainNoticeTag(tagEnum: TagInNoticeEnum): List<MainNoticeResponse>
}

@Component
class MainRepositoryImpl(
    private val queryFactory: JPAQueryFactory,
    private val mainImageService: MainImageService
) : MainRepository {
    override fun readMainSlide(): List<MainSlideResponse> {
        val newsEntityList = queryFactory.selectFrom(newsEntity)
            .where(newsEntity.isPrivate.eq(false), newsEntity.isSlide.eq(true))
            .orderBy(newsEntity.createdAt.desc())
            .limit(20).fetch()

        return newsEntityList.map {
            val imageURL = mainImageService.createImageURL(it.mainImage)
            MainSlideResponse(
                id = it.id,
                title = it.title,
                imageURL = imageURL,
                createdAt = it.createdAt,
                description = it.plainTextDescription.substring(
                    0,
                    100.coerceAtMost(it.plainTextDescription.length)
                )
            )
        }
    }

    override fun readMainNoticeTotal(): List<MainNoticeResponse> {
        return queryFactory.select(
            Projections.constructor(
                MainNoticeResponse::class.java,
                noticeEntity.id,
                noticeEntity.title,
                noticeEntity.createdAt
            )
        ).from(noticeEntity)
            .where(noticeEntity.isPrivate.eq(false), notRecruit())
            .orderBy(noticeEntity.createdAt.desc())
            .limit(6).fetch()
    }

    override fun readMainNoticeTag(tagEnum: TagInNoticeEnum): List<MainNoticeResponse> {
        return queryFactory.select(
            Projections.constructor(
                MainNoticeResponse::class.java,
                noticeTagEntity.notice.id,
                noticeTagEntity.notice.title,
                noticeTagEntity.notice.createdAt
            )
        ).from(noticeTagEntity)
            .rightJoin(noticeEntity).on(noticeTagEntity.notice.eq(noticeEntity))
            .rightJoin(tagInNoticeEntity).on(noticeTagEntity.tag.eq(tagInNoticeEntity))
            .where(noticeTagEntity.tag.name.eq(tagEnum))
            .where(noticeEntity.isPrivate.eq(false))
            .where(if (tagEnum == TagInNoticeEnum.RECRUIT) null else notRecruit())
            .orderBy(noticeTagEntity.notice.createdAt.desc())
            .limit(6).distinct().fetch()
    }

    /**
     * 채용 공지는 공지사항이 아니라 채용정보에 모은다(공지 목록의 excludeTag 와 같은 기준). 지난 3주 공지의 절반이 채용이라
     * 메인 '전체'가 채용으로 덮였다(2026-11 행정실 요청). 학부·대학원은 대상 표지라 채용 공지에도 붙을 수 있어 태그 칸에서도 뺀다.
     * 목록 쿼리의 조인과 별칭이 겹치면 그 태그 줄만 빠지고 글은 남으니 별칭을 따로 둔다.
     */
    private fun notRecruit(): BooleanExpression {
        val recruit = QNoticeTagEntity("recruitTag")
        return JPAExpressions.selectOne().from(recruit).where(
            recruit.notice.eq(noticeEntity),
            recruit.tag.name.eq(TagInNoticeEnum.RECRUIT)
        ).notExists()
    }
}
