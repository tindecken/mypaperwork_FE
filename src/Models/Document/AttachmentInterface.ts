export interface AttachmentInterface {
  id: string;
  fileName: string;
  fileSize: number;
  fileBlob: { type: string; data: number[] };
}
