export const ADMIN_MENU_SLIDE = 'slide';
export const ADMIN_MENU_IMPORTANT = 'important';
export const ADMIN_MENU_IMAGE_MODAL = 'imageModal';

export interface ImageModal {
  id: number;
  titleKo: string | null;
  titleEn: string | null;
  imageAltKo: string | null;
  imageAltEn: string | null;
  displayUntil: string | null;
  externalLink: string | null;
  imageUrl: string;
}

export interface SlidePreview {
  id: number;
  title: string;
  createdAt: string;
}

export interface SlidePreviewList {
  slides: SlidePreview[];
  total: number;
}

type ImportantCategory = 'notice' | 'news' | 'seminar';

export interface ImportantPreview {
  id: number;
  title: string;
  createdAt: string;
  category: ImportantCategory;
}

export interface ImportantPreviewList {
  importants: ImportantPreview[];
  total: number;
}
