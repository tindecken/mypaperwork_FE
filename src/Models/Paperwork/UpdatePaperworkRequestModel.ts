export interface UpdatePaperworkRequestModel {
  id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  priceCurrency: string | null;
  issueAt: string | null;
}
