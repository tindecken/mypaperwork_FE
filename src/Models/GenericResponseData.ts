export interface GenericResponseData {
  data?: object;
  error?: object;
  message: string;
  totalRecords?: number;
  totalFilteredRecords?: number;
  pageNumber?: number;
  pageSize?: number;
  success: boolean;
  statusCode?: number;
}
