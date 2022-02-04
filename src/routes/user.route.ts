import express from 'express'
import { sendError } from '../helpers/error.helper';
import { CreateUserRequest } from '../models/requests/create-user.request';
import { LoginRequest } from '../models/requests/login.request';
import { createUser, getUserAccounts, login } from '../services/user.service';

const UserRouter = express.Router();

/**
 * Sign Up for a user account
 */
UserRouter.post('/users/signup', async (req, res) => {
  try {
    const request = req.body as CreateUserRequest;
    await createUser(request);

    res.send('Success');
  } catch (error) {
    if (error.errorCode) {
      res.status(error.errorCode).send(error.errorMessage);
    } else {
      res.status(500).send(error);
    }
  }
});

/**
 * Login
 */
UserRouter.post('/users/login', async (req, res) => {
  try {
    const request = req.body as LoginRequest;
    const user = await login(request);

    res.send(user);
  } catch (error) {
    if (error.code) {
      res.status(error.code).send(error.message);
    }

    res.status(500).send(error);
  }
})

/**
 * Get Accounts related to the User
 */
UserRouter.get('/users/:id/accounts', async (req, res) => {
  try {
    const userId = req.params.id
    const accounts = await getUserAccounts(userId);

    res.send(accounts);
  } catch (error) {
    sendError(res, error)
  }
})

export default UserRouter;