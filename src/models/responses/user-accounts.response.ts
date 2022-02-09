export class UserAccountsResponse {
  accountId: string;
  accountName: string;
  monsters: AccountMonster[];
}

export class AccountMonster {
  name: string;
  element: number;
  thumbnailName: string;
  level: number;
}