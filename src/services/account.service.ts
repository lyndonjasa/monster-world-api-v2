import { CreateAccountRequest } from "../models/requests";
import { CreateAccountResponse } from "../models/responses";
import { starterGroups } from "../shared/constants";

/**
 * Creates an Account with three starter monsters
 * @param request the request object
 * @returns the response containing the account id
 */
export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
  try {
    const rookies = starterGroups.find(sg => sg.group === request.rookieGroup);

    return undefined
  } catch (error) {
    throw error;
  }
}