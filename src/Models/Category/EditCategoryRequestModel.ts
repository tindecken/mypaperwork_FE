export interface EditCategoryRequestModel {
  userId: string;
  categoryId: string;
  name: string;
  note: string | null;
  icon: string | null;
}
