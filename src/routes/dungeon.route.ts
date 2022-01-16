import express from 'express'
import { UploadDungeonRequest } from '../models/requests/upload-dungeon.request';
import { uploadDungeons } from '../services/dungeon.service';

const DungeonRouter = express.Router();

/**
 * Upload Dungeon Data
 */
DungeonRouter.post('/dungeons/upload', async (req, res) => {
  try {
    const request = req.body as UploadDungeonRequest[];
    const dungeons = await uploadDungeons(request);

    res.send(dungeons);
  } catch (error) {
    res.status(500).send(error);
  }
})

export default DungeonRouter;