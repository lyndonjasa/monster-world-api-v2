export class UserAccountsResponse {
  accountId: string;
  monsters: AccountMonster[];
}

export class AccountMonster {
  name: string;
  level: number;
}