export class SearchMonsterRequest {
  searchText: string;
  page: number;
  pageSize: number;
  filters: {
    elements: string[];
    stages: string[];
  }
  sortProperty: string;
  sortDirection: string;
}