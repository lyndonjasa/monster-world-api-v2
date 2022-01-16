import express from 'express'
import { CreateUserRequest } from '../models/requests/create-user.request';
import { createUser } from '../services/user.service';

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
    throw error
  }
});