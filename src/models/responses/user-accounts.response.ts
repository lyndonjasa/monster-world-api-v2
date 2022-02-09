export class UserAccountsResponse {
  accountId: string;
  accountName: string;
  monsters: AccountMonster[];
}

export class AccountMonster {
  name: string;
  level: number;
}