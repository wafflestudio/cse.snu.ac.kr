export interface NewsPreview {
  id: number;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  isPrivate: boolean;
  imageURL: string | null;
  date: string;
}

export interface NewsPreviewList {
  total: number;
  searchList: NewsPreview[];
}
