package com.wafflestudio.csereal.core.notice.suggest

/** 태그 후보 하나. `tag` 는 프론트 체크박스가 쓰는 [com.wafflestudio.csereal.core.notice.database.TagInNoticeEnum.krName]. */
data class TagSuggestion(
    val tag: String,
    /** 이 태그가 맞을 확률. 태그마다 임계값이 달라서 값을 그대로 보여준다. */
    val confidence: Double
)
