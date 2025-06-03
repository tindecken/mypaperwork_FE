export interface UpdatePaperworkRequestModel {
  paperworkId: string;
  name: string | null;
  note: string | null;
  customFields: { key: string; value: string }[];
  issueAt: string | null;
}
