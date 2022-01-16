import express from 'express'
import { UploadMonsterRequest } from '../models/requests/upload-monster.request';
import { uploadMonsters } from '../services/monster.service';

const MonsterRouter = express.Router();

/**
 * Upload and Convert Monster Data
 */
MonsterRouter.post('/monsters/upload', async (req, res) => {
  try {
    const request = req.body as UploadMonsterRequest[];
    const monsters = await uploadMonsters(request);

    res.send(monsters);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default MonsterRouter;