package com.wafflestudio.csereal.common.sitemap

import com.wafflestudio.csereal.core.member.database.ProfessorStatus
import jakarta.persistence.EntityManager
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * 공개 콘텐츠의 id 와 수정 시각만 모은다. 목록 API 는 페이지 단위에 본문·태그까지 실어 1.4만 건을 훑기엔 무겁고,
 * 도메인 리포지토리마다 메서드를 늘리는 대신 id·modifiedAt 두 컬럼만 JPQL 로 뽑는다.
 */
@Service
@Transactional(readOnly = true)
class SitemapService(
    private val em: EntityManager
) {
    fun entries() = SitemapResponse(
        notice = select("notice", "e.isPrivate = false"),
        news = select("news", "e.isPrivate = false"),
        seminar = select("seminar", "e.isPrivate = false"),
        professor = select("professor", "e.status = :status", "status" to ProfessorStatus.ACTIVE),
        emeritusProfessor = select("professor", "e.status = :status", "status" to ProfessorStatus.INACTIVE),
        staff = select("staff"),
        lab = select("lab")
    )

    // JPQL 의 엔티티 이름은 @Entity(name) — 클래스 이름이 아니다.
    private fun select(entity: String, where: String? = null, param: Pair<String, Any>? = null): List<SitemapEntry> {
        val jpql = "select e.id, e.modifiedAt from $entity e" + (where?.let { " where $it" } ?: "") + " order by e.id"
        val query = em.createQuery(jpql, Array<Any?>::class.java)
        param?.let { (name, value) -> query.setParameter(name, value) }
        return query.resultList.map { row -> SitemapEntry(row[0] as Long, row[1] as LocalDateTime?) }
    }
}
