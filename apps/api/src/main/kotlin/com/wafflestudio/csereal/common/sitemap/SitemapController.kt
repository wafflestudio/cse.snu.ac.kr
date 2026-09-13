package com.wafflestudio.csereal.common.sitemap

import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/api/v2/sitemap")
class SitemapController(
    private val sitemapService: SitemapService
) {
    @GetMapping
    @Operation(
        summary = "사이트맵 항목",
        description = "공개 콘텐츠(공지·새소식·세미나·교수·명예교수·직원·연구실)의 id 와 수정 시각. 프론트가 /sitemap.xml 을 만들 때 쓴다."
    )
    fun entries(): ResponseEntity<SitemapResponse> =
        ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
            .body(sitemapService.entries())
}
