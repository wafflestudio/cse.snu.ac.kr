import type {
  AdmissionsMainType,
  AdmissionsPostType,
  AdmissionsResponse,
} from '@/types/api';
import { api } from '@/utils/api';

export async function fetchAdmissions(
  mainType: AdmissionsMainType,
  postType: AdmissionsPostType,
): Promise<AdmissionsResponse> {
  return api
    .get(`v2/admissions/${mainType}/${postType}`)
    .json<AdmissionsResponse>();
}
