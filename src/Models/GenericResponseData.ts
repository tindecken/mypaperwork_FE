export interface GenericResponseData {
  Data?: object;
  Error?: object;
  Message: string;
  TotalRecords?: number;
  TotalFilteredRecords?: number;
  PageNumber?: number;
  PageSize?: number;
  Success: boolean;
  StatusCode?: number;
}
