export interface ImageInterface {
  id: string;
  fileName: string;
  fileSize: number;
  fileBlob: { type: string; data: number[] };
}
