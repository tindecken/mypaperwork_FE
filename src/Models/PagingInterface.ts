export interface Paging {
  pageNumber?: number;
  pageSize?: number;
  filterValue?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}
