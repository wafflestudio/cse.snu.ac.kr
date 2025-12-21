import type { Attachment } from '~/types/api/v2/attachment';

export type AboutContent = {
  description: string;
  imageURL: string | null;
  attachments: Attachment[];
};
