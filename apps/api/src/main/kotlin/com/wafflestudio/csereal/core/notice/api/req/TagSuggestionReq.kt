package com.wafflestudio.csereal.core.notice.api.req

/** 편집 중인 글 그대로 — 저장 전에도 제안을 받으려고 id 가 아니라 본문을 받는다. */
data class TagSuggestionReq(
    val title: String,
    val description: String
)
