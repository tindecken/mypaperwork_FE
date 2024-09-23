import { Category } from '../Category/CategoryInterface';
import { Paperwork } from './PaperworkInterface';

export interface PaperworkDetails extends Paperwork, Category {
  categories: Category[];
  attachments?: {
    id: string;
    fileName: string;
    fileSize: number;
  }[];
  images?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileBlob: { type: string; data: number[] };
  }[];
}
