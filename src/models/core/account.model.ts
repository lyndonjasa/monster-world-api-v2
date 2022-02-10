import { IAccount, IDetailedMonsterDocument, IItemDocument } from "../../mongo/interfaces";

export class AccountModel implements IAccount {
  userId: string;
  accountName: string;
  currency: number;
  unlockedMonsters: string[];
  party?: IDetailedMonsterDocument[] | string[];
  inventory?: IItemDocument[] | string[];
  isActive: boolean;
}