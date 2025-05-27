export interface EditCategoryRequestModel {
  userId: string;
  categoryId: string;
  name: string;
  icon: string;
  description?: string;
}
