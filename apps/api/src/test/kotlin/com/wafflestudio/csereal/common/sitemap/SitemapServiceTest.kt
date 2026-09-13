package com.wafflestudio.csereal.common.sitemap

import com.wafflestudio.csereal.core.news.api.req.CreateNewsReq
import com.wafflestudio.csereal.core.news.database.NewsRepository
import com.wafflestudio.csereal.core.news.service.NewsService
import com.wafflestudio.csereal.global.config.MySQLTestContainerConfig
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringTestExtension
import io.kotest.extensions.spring.SpringTestLifecycleMode
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.nulls.shouldNotBeNull
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles
import java.time.LocalDateTime

@ActiveProfiles("test")
@SpringBootTest
@Import(MySQLTestContainerConfig::class)
class SitemapServiceTest(
    private val sitemapService: SitemapService,
    private val newsService: NewsService,
    private val newsRepository: NewsRepository
) : BehaviorSpec() {
    init {
        extensions(SpringTestExtension(SpringTestLifecycleMode.Root))

        afterSpec { newsRepository.deleteAll() }

        fun create(isPrivate: Boolean) = newsService.createNews(
            CreateNewsReq(
                title = if (isPrivate) "비공개" else "공개",
                titleForMain = null,
                description = "<p>본문</p>",
                date = LocalDateTime.now(),
                isPrivate = isPrivate,
                isSlide = false,
                isImportant = false,
                importantUntil = null,
                tags = emptyList()
            ),
            null,
            null
        )

        Given("공개 글과 비공개 글이 있으면") {
            val public = create(isPrivate = false)
            val private = create(isPrivate = true)
            val news = sitemapService.entries().news

            Then("공개 글만 id 와 수정 시각이 나온다") {
                news.map { it.id } shouldContain public.id
                news.map { it.id } shouldNotContain private.id
                news.first { it.id == public.id }.modifiedAt.shouldNotBeNull()
            }
        }
    }
}
