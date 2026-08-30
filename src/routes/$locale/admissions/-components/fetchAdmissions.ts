import type { AdmissionsResponse } from '@/types/api/v2/admissions';
import { api } from '@/utils/api';

export type MainType = 'undergraduate' | 'graduate' | 'international';
export type PostType =
  | 'early-admission'
  | 'regular-admission'
  | 'exchange-visiting'
  | 'graduate'
  | 'scholarships'
  | 'undergraduate';

export async function fetchAdmissions(
  mainType: MainType,
  postType: PostType,
): Promise<AdmissionsResponse> {
  return api
    .get(`v2/admissions/${mainType}/${postType}`)
    .json<AdmissionsResponse>();
}
