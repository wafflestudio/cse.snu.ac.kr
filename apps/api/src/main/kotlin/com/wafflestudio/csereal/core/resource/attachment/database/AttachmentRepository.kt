package com.wafflestudio.csereal.core.resource.attachment.database

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface AttachmentRepository : JpaRepository<AttachmentEntity, Long> {
    fun findByFilename(filename: String): AttachmentEntity

    // 비공개 공지·새소식·세미나에 달린 첨부인가. 파일 내려받기가 글 공개 여부를 따르게 한다.
    @Query(
        """
        SELECT COUNT(a) > 0 FROM attachment a
        LEFT JOIN a.notice n LEFT JOIN a.news w LEFT JOIN a.seminar s
        WHERE a.filename = :filename
          AND (n.isPrivate = true OR w.isPrivate = true OR s.isPrivate = true)
        """
    )
    fun existsPrivateByFilename(@Param("filename") filename: String): Boolean
}
