export interface ItemResponse {
  item: string;
  itemId?: string;
  quantity: number;
  type: string;
}

export class BuyItemResponse {
  accountId: string;
  items: ItemResponse[];
}