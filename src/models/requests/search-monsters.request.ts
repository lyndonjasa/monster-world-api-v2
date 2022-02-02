export class SearchMonsterRequest {
  searchText: string;
  page: number;
  pageSize: number;
  filters: {
    elements: string[];
    stages: string[];
  }
  sortOrder: string;
  sortDirection: boolean;
}