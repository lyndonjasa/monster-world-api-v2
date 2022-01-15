import express from 'express';
import { UploadEvolutionRequest } from '../models/requests/upload-evolution.request';
import { getEvolutions, uploadEvolutions } from '../services/evolution.service';

const EvolutionRouter = express.Router();

/**
 * Get All Evolutions
 */
EvolutionRouter.get('/evolutions', async (_, res) => {
  try {
    const evolutions = await getEvolutions();

    res.send(evolutions);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Upload Evolutions
 */
EvolutionRouter.post('/evolutions/upload', async (req, res) => {
  try {
    const request = req.body as UploadEvolutionRequest[];
    const evolutions = await uploadEvolutions(request);
    
    res.send(evolutions);
  } catch (error) {
    res.status(500).send(error);
  }
})

export default EvolutionRouter;