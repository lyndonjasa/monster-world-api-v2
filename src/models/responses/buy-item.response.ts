export interface ItemResponse {
  item: string;
  quantity: number;
}

export class BuyItemResponse {
  accountId: string;
  items: ItemResponse[];
}