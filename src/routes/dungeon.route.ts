import express from 'express'
import { sendError } from '../helpers/error.helper';
import { UploadDungeonRequest } from '../models/requests/upload-dungeon.request';
import { clearSessions, getDungeonById, getDungeons, produceEnemies, uploadDungeons } from '../services/dungeon.service';

const DungeonRouter = express.Router();

/**
 * Get All Dungeons
 */
DungeonRouter.get('/dungeons', async (_, res) => {
  try {
    const dungeons = await getDungeons();

    res.send(dungeons);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Get Dungeon Details by Id
 */
DungeonRouter.get('/dungeons/:id', async (req, res) => {
  try {
    const id = req.params.id
    const dungeon = await getDungeonById(id);

    res.send(dungeon);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Get Dungeon Details by Id
 */
 DungeonRouter.get('/dungeons/:id/enter', async (req, res) => {
  try {
    const id = req.params.id
    const dungeon = await produceEnemies(id);

    res.send(dungeon);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Get Dungeon Details by Id
 */
 DungeonRouter.post('/dungeons/clear', async (_, res) => {
  try {
    const result = await clearSessions();

    res.send(result);
  } catch (error) {
    sendError(res, error)
  }
})

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