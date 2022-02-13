export interface ItemResponse {
  item: string;
  itemId?: string;
  quantity: number;
  type?: string;
  description?: string;
}

export class BuyItemResponse {
  accountId: string;
  items: ItemResponse[];
}