import { Category } from '../Category/CategoryInterface';
import { AttachmentInterface } from '../Document/AttachmentInterface';
import { Paperwork } from './PaperworkInterface';

export interface PaperworkDetails extends Paperwork {
  categories: Category[];
  attachments?: AttachmentInterface[];
  images?: {
    id: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    isCover: boolean;
    imageArrayBuffer?: Uint8Array | string;
  }[];
}
