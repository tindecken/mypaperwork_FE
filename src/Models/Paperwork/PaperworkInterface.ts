export interface Paperwork {
  id: string;
  name: string;
  description: string;
  issuedAt: Date;
  price: number;
  priceCurrency: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  categoryName: string;
  categoryDescription: string;
  categoryId: string;
  coverBlob?: { type: string; data: number[] };
  coverFileName?: string;
  documentCount?: number;
}
