export interface ItemResponse {
  item: string;
  itemId?: string;
  quantity: number;
}

export class BuyItemResponse {
  accountId: string;
  items: ItemResponse[];
}