package com.wafflestudio.csereal.core.main.dto

import com.querydsl.core.annotations.QueryProjection

data class NoticesResponse @QueryProjection constructor(
    val all: List<MainNoticeResponse>,
    val scholarship: List<MainNoticeResponse>,
    val undergraduate: List<MainNoticeResponse>,
    val graduate: List<MainNoticeResponse>,
    // 채용 공지는 공지사항(위 넷)에서 빠지고 여기만 모인다. 메인 공지 칸에서 구분선 뒤 '채용정보'
    val recruit: List<MainNoticeResponse>
)
