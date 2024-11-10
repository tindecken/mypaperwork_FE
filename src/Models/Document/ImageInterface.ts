export interface ImageInterface {
  id: string;
  fileName: string;
  fileSize: number;
  fileBlob: { type: string; data: number[] };
  reducedBlob: { type: string; data: number[] };
  reducedSize: number;
  isCover: boolean;
}
