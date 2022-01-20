import express from 'express'
import { BuyItemRequest } from '../models/requests';
import { UploadItemRequest } from '../models/requests/upload-item.request';
import { buyItems, getItems, uploadItems } from '../services/item.service';

const ItemsRouter = express.Router();

/**
 * Get List of Items
 */
ItemsRouter.get('/items', async (_, res) => {
  try {
    const items = await getItems();

    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Uplaods and Converts Items from CSV
 */
ItemsRouter.post('/items/upload', async (req, res) => {
  try {
    const request = req.body as UploadItemRequest[];
    const items = await uploadItems(request);

    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Buy Items for the Account
 */
ItemsRouter.post('/items/buy', async (req, res) => {
  try {
    const request = req.body as BuyItemRequest;
    const response = await buyItems(request)

    res.send(response);
  } catch (error) {
    if (error.errorCode) {
      res.status(error.errorCode).send(error.errorMessage);
    } else {
      res.status(500).send(error);
    }
  }
})

export default ItemsRouter;