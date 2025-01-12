export interface ImageInterface {
  id: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  isCover: boolean;
  imageArrayBuffer?: Uint8Array;
}
