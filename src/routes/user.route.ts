import express from 'express'
import { CreateUserRequest } from '../models/requests/create-user.request';
import { LoginRequest } from '../models/requests/login.request';
import { createUser, login } from '../services/user.service';

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
    if (error.code) {
      res.status(error.code).send(error.message);
    }

    res.status(500).send(error);
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

export default UserRouter;