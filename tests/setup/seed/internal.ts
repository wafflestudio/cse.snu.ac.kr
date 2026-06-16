import { postJson } from './client';

/**
 * 학부 메일링리스트(.internal) 콘텐츠 싱글톤.
 * modifyInternal이 upsert(count 0이면 save)라 SQL 없이 PUT API로 시드 가능.
 */
export const INTERNAL_SEED = {
  description: '학부 메일링리스트 안내입니다.',
} as const;

export async function seedInternal(cookie: string) {
  await postJson(
    cookie,
    '/api/v2/internal',
    { description: `<p>${INTERNAL_SEED.description}</p>` },
    'PUT',
  );
}
