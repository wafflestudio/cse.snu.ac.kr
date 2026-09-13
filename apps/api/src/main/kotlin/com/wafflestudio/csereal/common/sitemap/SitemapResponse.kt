package com.wafflestudio.csereal.common.sitemap

import java.time.LocalDateTime

/** 사이트맵 한 줄에 필요한 최소 정보. URL 은 프론트가 만든다(로케일 프리픽스·경로는 프론트 소유). */
data class SitemapEntry(val id: Long, val modifiedAt: LocalDateTime?)

data class SitemapResponse(
    val notice: List<SitemapEntry>,
    val news: List<SitemapEntry>,
    val seminar: List<SitemapEntry>,
    val professor: List<SitemapEntry>,
    val emeritusProfessor: List<SitemapEntry>,
    val staff: List<SitemapEntry>,
    val lab: List<SitemapEntry>
)
