export interface Paging {
  pageNumber: number;
  pageSize: number;
  filterValue?: string;
  sortBy?: string;
  isSortDescending?: boolean;
}
