import express from 'express'
import { UploadTalentRequest } from '../models/requests/upload-talent.request';
import { getTalents, uploadTalents } from '../services/talent.service';

const TalentRoute = express.Router();

/**
 * Get List of Talents
 */
TalentRoute.get('/talents', async (_, res) => {
  try {
    const talents = await getTalents();

    res.send(talents);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Upload and Convert Talents
 */
TalentRoute.post('/talents/upload', async (req, res) => {
  try {
    const talents = req.body as UploadTalentRequest[];

    await uploadTalents(talents);
  } catch (error) {
    res.status(500).send(error);
  }
})

export default TalentRoute;