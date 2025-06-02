export interface CreatePaperworkRequestModel {
  categoryId: string;
  name: string;
  note?: string;
  issueAt: string | null;
  customFields?: string | null;
  files?: string[];
}
