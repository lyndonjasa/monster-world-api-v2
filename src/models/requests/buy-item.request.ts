export interface ItemRequest {
  itemId: string;
  quantity: number;
}

export class BuyItemRequest {
  accountId: string;
  items: ItemRequest[];
}