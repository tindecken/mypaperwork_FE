export interface CreatePaperworkRequestModel {
  categoryId: string;
  name: string;
  description: string;
  price: number | null;
  priceCurrency: string | null;
  issueAt: string | null;
  files?: string[];
}
