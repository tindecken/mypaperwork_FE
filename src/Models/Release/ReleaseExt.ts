import { Release } from './Release';

export interface ReleaseExt {
  TotalRecords: number;
  TotalFiteredRecords: number;
  Data: Release[];
}
