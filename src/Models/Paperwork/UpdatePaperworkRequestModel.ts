export interface UpdatePaperworkRequestModel {
  paperworkId: string;
  name: string | null;
  note: string | null;
  customFields?: string | null;
  issueAt: string | null;
}
