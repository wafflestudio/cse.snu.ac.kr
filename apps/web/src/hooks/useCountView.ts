import { useEffect } from 'react';
import { api } from '@/utils/api';

type ViewCountable = 'notice' | 'news' | 'seminar';

/** 조회수 1 증가. 실패해도 화면에 영향이 없어 조용히 삼킨다. */
export function useCountView(type: ViewCountable, id: number) {
  useEffect(() => {
    api.post(`v2/${type}/${id}/view`).catch(() => {});
  }, [type, id]);
}
