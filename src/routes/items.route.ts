import express from 'express'
import { UploadItemRequest } from '../models/requests/upload-item.request';
import { uploadItems } from '../services/item.service';

const ItemsRouter = express.Router();

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

export default ItemsRouter;