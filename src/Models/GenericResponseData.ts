export interface GenericResponseData {
  data?: any;
  error?: object;
  message: string;
  totalRecords?: number;
  totalFilteredRecords?: number;
  pageNumber?: number;
  pageSize?: number;
  success: boolean;
  statusCode?: number;
}
