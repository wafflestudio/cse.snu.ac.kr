import type { Attachment } from '~/types/api/v2/attachment';

export type StudentType = 'undergraduate' | 'graduate';

export interface Guide {
  description: string;
  attachments: Attachment[];
}
