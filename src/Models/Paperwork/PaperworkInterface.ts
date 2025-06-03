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
  categories: string[];
  coverBase64?: string;
  coverFileName?: string;
  documentCount?: number;
  customFields?: string;
  note?: string;
}
