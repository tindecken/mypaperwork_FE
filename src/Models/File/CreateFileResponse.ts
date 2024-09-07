import { FilesTable } from './FilesTable';

export interface CreateFileResponse {
  token: string;
  descrition?: string;
  file: FilesTable;
}
