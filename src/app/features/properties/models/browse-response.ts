import { BrowseProperty } from './browse-property';

export interface BrowseResponse {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: BrowseProperty[];
}
