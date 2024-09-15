import axios, { AxiosError } from 'axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { Paging } from 'src/Models/PagingInterface';

export default function handlePaging(paging: Paging): string {
  let query = '';
  // Pagesize
  if (paging.pageNumber) {
    query += `pageNumber=${paging.pageNumber}&`;
    if (paging.pageSize) {
      query += `pageSize=${paging.pageSize}&`;
    } else {
      query += `pageSize=${process.env.DEFAULT_PAGESIZE}&`;
    }
  } else {
    query += `pageNumber=1&pageSize=${process.env.DEFAULT_PAGESIZE}`;
  }
  // Sorting
  if (paging.sortField) {
    query += `&sortField=${paging.sortField}`;
    if (paging.sortDirection) {
      query += `&sortDirection=${paging.sortDirection}`;
    } else {
      query += '&sortDirection=desc';
    }
  } else {
    query += '&sortField=createdAt&sortDirection=desc';
  }
  // Filtering
  if (paging.filterValue) {
    query += `&filterValue=${paging.filterValue}`;
  }
  return query;
}
