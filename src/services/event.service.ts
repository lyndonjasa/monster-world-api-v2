import { throwError } from "../helpers/error.helper";
import { TameActionRequest } from "../models/requests";
import { ErrorResponse, TameActionResponse } from "../models/responses";
import { Account, Monster } from "../mongo/models";
import config from "../shared/config";

/**
 * Try and Tame Monster
 * @param request Tame Parameters
 */
export async function tameMonster(request: TameActionRequest): Promise<TameActionResponse> {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const usedSession = config.environment === 'production' ? session : null;

    // find and validate account
    const account = await Account.findById(request.accountId);
    if (!account) {
      throw { errorCode: 404, errorMessage: 'Account not found' } as ErrorResponse
    }

    // validate if account has the item
    const accountItems = account.inventory as string[];
    if (!accountItems.some(ai => ai === request.itemId)) {
      throwError(400, 'Invalid Item Id');
    }

    return undefined;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}