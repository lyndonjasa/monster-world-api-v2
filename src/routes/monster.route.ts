import express, { request } from 'express'
import { UploadMonsterRequest } from '../models/requests/upload-monster.request';
import { UploadSpriteRequest } from '../models/requests/upload-sprite.request';
import { getMonsters, uploadMonsters, uploadMonsterSprites } from '../services/monster.service';

const MonsterRouter = express.Router();

/**
 * Get All Monster Details
 */
MonsterRouter.get('/monsters', async (_, res) => {
  try {
    const monsters = await getMonsters();

    res.send(monsters);
  } catch (error) {
    res.status(500).send(error);
  }
})

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

/**
 * Upload Sprites and Update Monster Data
 */
MonsterRouter.post('/monsters/sprites/upload', async (req, res) => {
  try {
    const request = req.body as UploadSpriteRequest[];
    const monsters = await uploadMonsterSprites(request);

    res.send(monsters);
  } catch (error) {
    res.status(500).send(error);
  }
})