export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  paperworkCount: number;
}
