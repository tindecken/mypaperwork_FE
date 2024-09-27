import { Category } from '../Category/CategoryInterface';
import { AttachmentInterface } from '../Document/AttachmentInterface';
import { Paperwork } from './PaperworkInterface';

export interface PaperworkDetails extends Paperwork, Category {
  categories: Category[];
  attachments?: AttachmentInterface[];
  images?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileBlob: { type: string; data: number[] };
  }[];
}
