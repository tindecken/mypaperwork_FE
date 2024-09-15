export interface Category {
  id: string;
  fileId: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  paperworkCount: number;
}
