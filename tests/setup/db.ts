import mysql, {
  type Connection,
  type ResultSetHeader,
  type RowDataPacket,
} from 'mysql2/promise';

/**
 * DB 직접 조작 단일 출처(globalSetup 전용) — 리셋·content 싱글톤 시드·날짜 정규화.
 * e2e 컨테이너에선 compose(tests/setup/compose.yml)가 E2E_DB_HOST=db를 주입합니다.
 * 로컬 docker 전용이라 리셋 자유(staging/프로덕션은 절대 건드리지 않음).
 */
async function withDb<T>(fn: (conn: Connection) => Promise<T>): Promise<T> {
  const conn = await mysql.createConnection({
    host: process.env.E2E_DB_HOST ?? '127.0.0.1',
    port: Number(process.env.E2E_DB_PORT ?? 3306),
    user: process.env.E2E_DB_USER ?? 'root',
    password: process.env.E2E_DB_PASSWORD ?? 'password',
    database: process.env.E2E_DB_NAME ?? 'csereal',
    charset: 'utf8mb4',
  });
  try {
    return await fn(conn);
  } finally {
    await conn.end();
  }
}

/**
 * 모든 테이블을 비웁니다(flyway 이력은 보존 → 스키마 유지).
 * TRUNCATE로 auto-increment까지 초기화 → 시드 id가 매 런 동일.
 */
export async function resetDb() {
  await withDb(async (conn) => {
    const [tables] = await conn.query<RowDataPacket[]>(
      `SELECT table_name AS name FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name <> 'flyway_schema_history'`,
    );
    await conn.query('SET FOREIGN_KEY_CHECKS=0');
    for (const { name } of tables) {
      await conn.query(`TRUNCATE TABLE \`${name}\``);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS=1');
  });
}

/** about 계열 ko/en 쌍 + about_language 링크. name은 DIRECTIONS만 필요(DirDto.name!!). */
async function insertAboutPair(
  conn: Connection,
  postType: string,
  ko: string,
  en: string,
  name?: { ko: string; en: string },
) {
  const insert = async (language: string, description: string, n?: string) => {
    const [res] = await conn.execute<ResultSetHeader>(
      `INSERT INTO about (post_type, language, ${n !== undefined ? 'name, ' : ''}description, search_content, created_at, modified_at)
       VALUES (?, ?, ${n !== undefined ? '?, ' : ''}?, '', NOW(), NOW())`,
      n !== undefined
        ? [postType, language, n, description]
        : [postType, language, description],
    );
    return res.insertId;
  };
  const koId = await insert('KO', ko, name?.ko);
  const enId = await insert('EN', en, name?.en);
  await conn.execute(
    `INSERT INTO about_language (korean_id, english_id, created_at, modified_at)
     VALUES (?, ?, NOW(), NOW())`,
    [koId, enId],
  );
}

/**
 * content 싱글톤 시드 — PUT(수정)만 있고 생성 API가 없어 빈 DB면 404/500인 데이터.
 * API로 생성 가능한 데이터는 절대 여기 넣지 않는다(seed/*.ts로 — CLAUDE.md §3).
 */
export async function seedContent() {
  await withDb(async (conn) => {
    // OVERVIEW 본문의 인라인 font-size span은 CSP 회귀 가드다(제거 금지). strict CSP가
    // 백엔드 HTML의 인라인 스타일을 떼면 글자가 작아져 overview read 스크린샷이 깨진다
    // → HTMLViewer/processHtmlForCsp 경로의 회귀를 비주얼로 잡는다.
    await insertAboutPair(
      conn,
      'OVERVIEW',
      '<p>학부 소개 본문입니다.</p><p><span style="font-size: 28px;">CSP스타일보존</span></p>',
      '<p>Department overview.</p>',
    );
    await insertAboutPair(
      conn,
      'GREETINGS',
      '<p>학부장 인사말입니다.</p>',
      '<p>Greetings from the chair.</p>',
    );
    await insertAboutPair(
      conn,
      'HISTORY',
      '<p>학부 연혁입니다.</p>',
      '<p>Department history.</p>',
    );
    await insertAboutPair(
      conn,
      'FUTURE_CAREERS',
      '<p>졸업생 진로 안내 본문입니다.</p>',
      '<p>Career paths overview.</p>',
    );
    await insertAboutPair(
      conn,
      'CONTACT',
      '<p>연락처 안내입니다.</p>',
      '<p>Contact information.</p>',
    );
    await insertAboutPair(
      conn,
      'DIRECTIONS',
      '<p>지하철 2호선 서울대입구역에서 버스 환승.</p>',
      '<p>Subway Line 2 to SNU Station, then bus.</p>',
      { ko: '대중교통', en: 'By Public Transit' },
    );
    await insertAboutPair(
      conn,
      'DIRECTIONS',
      '<p>관악 캠퍼스 정문으로 진입.</p>',
      '<p>Enter via the Gwanak main gate.</p>',
      { ko: '자가용', en: 'By Car' },
    );

    // academics: language별 독립 행(페어링 테이블 없음).
    const academics: [string, string, string, string][] = [
      [
        'GUIDE',
        'UNDERGRADUATE',
        '<p>학부 안내 본문입니다.</p>',
        '<p>Undergraduate guide.</p>',
      ],
      [
        'GUIDE',
        'GRADUATE',
        '<p>대학원 안내 본문입니다.</p>',
        '<p>Graduate guide.</p>',
      ],
      [
        'DEGREE_REQUIREMENTS',
        'UNDERGRADUATE',
        '<p>졸업 규정 본문입니다.</p>',
        '<p>Degree requirements.</p>',
      ],
      [
        'SCHOLARSHIP',
        'UNDERGRADUATE',
        '<p>장학 제도 안내입니다.</p>',
        '<p>Scholarships intro.</p>',
      ],
    ];
    for (const [postType, studentType, ko, en] of academics) {
      for (const [language, description] of [
        ['KO', ko],
        ['EN', en],
      ]) {
        await conn.execute(
          `INSERT INTO academics (post_type, student_type, language, description, created_at, modified_at)
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [postType, studentType, language, description],
        );
      }
    }

    // admissions: main_type/post_type별 ko/en 독립 행.
    // name은 AdmissionsDto에서 non-null이라 빈 문자열로라도 채운다(NULL이면 500).
    const admissions: [string, string, string, string][] = [
      [
        'UNDERGRADUATE',
        'REGULAR_ADMISSION',
        '<p>학부 정시 모집 안내입니다.</p>',
        '<p>Undergraduate regular admission.</p>',
      ],
      [
        'UNDERGRADUATE',
        'EARLY_ADMISSION',
        '<p>학부 수시 모집 안내입니다.</p>',
        '<p>Undergraduate early admission.</p>',
      ],
      [
        'GRADUATE',
        'REGULAR_ADMISSION',
        '<p>대학원 모집 안내입니다.</p>',
        '<p>Graduate admission.</p>',
      ],
      [
        'INTERNATIONAL',
        'UNDERGRADUATE',
        '<p>외국인 학부 모집 안내입니다.</p>',
        '<p>International undergraduate.</p>',
      ],
      [
        'INTERNATIONAL',
        'GRADUATE',
        '<p>외국인 대학원 모집 안내입니다.</p>',
        '<p>International graduate.</p>',
      ],
      [
        'INTERNATIONAL',
        'EXCHANGE_VISITING',
        '<p>교환·방문 학생 안내입니다.</p>',
        '<p>Exchange and visiting students.</p>',
      ],
      [
        'INTERNATIONAL',
        'SCHOLARSHIPS',
        '<p>외국인 장학 안내입니다.</p>',
        '<p>International scholarships.</p>',
      ],
    ];
    for (const [mainType, postType, ko, en] of admissions) {
      for (const [language, description] of [
        ['KO', ko],
        ['EN', en],
      ]) {
        await conn.execute(
          `INSERT INTO admissions (main_type, post_type, language, name, description, search_content, created_at, modified_at)
           VALUES (?, ?, ?, '', ?, '', NOW(), NOW())`,
          [mainType, postType, language, description],
        );
      }
    }

    // Top Conference List: getConferencePage/modifyConferences가 conference_page 행을
    // 전제(findAll()[0]). 생성 API가 없어 빈 행 1개(author_id는 시더의 PATCH가 staff로 채움).
    await conn.execute(
      'INSERT INTO conference_page (created_at, modified_at, author_id) VALUES (NOW(), NOW(), NULL)',
    );

    // 예약 방(room): 참조 데이터인데 Flyway 시드가 없고(운영은 수동 삽입) reset이 truncate함.
    // 프론트 roomNameToId(1~16)와 id를 맞춰 16개 시드(없으면 예약 생성이 'Room Not Found').
    // location은 ReservationDto.roomLocation이 non-null이라 반드시 채운다(NULL이면 500).
    const rooms: [number, number, string, string, string][] = [
      [1, 20, '301-417', '301동', 'SEMINAR'],
      [2, 11, '301-521', '301동', 'SEMINAR'],
      [3, 20, '301-551-4', '301동', 'SEMINAR'],
      [4, 4, '301-552-1', '301동', 'SEMINAR'],
      [5, 5, '301-552-2', '301동', 'SEMINAR'],
      [6, 4, '301-552-3', '301동', 'SEMINAR'],
      [7, 6, '301-553-6', '301동', 'SEMINAR'],
      [8, 20, '301-317', '301동', 'SEMINAR'],
      [9, 10, '302-308', '302동', 'SEMINAR'],
      [10, 10, '302-309-1', '302동', 'SEMINAR'],
      [11, 10, '302-309-2', '302동', 'SEMINAR'],
      [12, 10, '302-309-3', '302동', 'SEMINAR'],
      [13, 30, '302-311-1', '302동', 'LAB'],
      [14, 30, '302-310-2', '302동', 'LAB'],
      [15, 54, '302-208', '302동', 'LECTURE'],
      [16, 70, '302-209', '302동', 'LECTURE'],
    ];
    await conn.query(
      `INSERT INTO room (id, capacity, name, location, type, created_at, modified_at)
       VALUES ${rooms.map(() => '(?, ?, ?, ?, ?, NOW(), NOW())').join(', ')}`,
      rooms.flat(),
    );
  });
}

/**
 * 게시물 created_at/modified_at을 고정 시각으로 정규화합니다.
 * 서버가 생성 시각을 박아 매 런 달라지는데, 화면에 렌더되면 비주얼 baseline이 비결정적이
 * 된다(시:분 글자 폭 변동은 마스킹으로도 불안정) → 시드 직후 고정값으로. 날짜가 화면에
 * 노출되는 게시물 테이블이 늘면 여기 한 줄 추가.
 */
export async function normalizeDates() {
  const FIXED = '2024-03-15 09:00:00';
  await withDb(async (conn) => {
    await conn.execute('UPDATE notice SET created_at=?, modified_at=?', [
      FIXED,
      FIXED,
    ]);
    // conference_page는 modified_at(수정 날짜)이 Top Conference List에 노출된다.
    await conn.execute('UPDATE conference_page SET modified_at=?', [FIXED]);
    // news 목록/상세는 payload date를 쓰지만, 메인 NewsCard는 created_at을 노출.
    await conn.execute('UPDATE news SET created_at=?, modified_at=?', [
      FIXED,
      FIXED,
    ]);
  });
}
