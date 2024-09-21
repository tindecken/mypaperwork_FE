import axios, { AxiosError } from 'axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { Paging } from 'src/Models/PagingInterface';

export default function handlePaging(paging?: Paging): string {
  console.log('Handling paging:', paging);
  let query = '?';
  // Pagesize
  if (paging && paging.pageNumber) {
    query += `pageNumber=${paging.pageNumber}&`;
    if (paging.pageSize) {
      query += `pageSize=${paging.pageSize}&`;
    } else {
      query += 'pageSize=20&';
    }
  } else {
    query += 'pageNumber=1&pageSize=20';
  }
  // Sorting
  if (paging && paging.sortField) {
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
  if (paging && paging.filterValue) {
    query += `&filterValue=${paging.filterValue}`;
  }
  return query;
}
