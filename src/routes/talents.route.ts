import express from 'express'
import { BackdoorTalentRequest } from '../models/requests';
import { UploadTalentRequest } from '../models/requests/upload-talent.request';
import { addTalentPoints, getTalents, uploadTalents } from '../services/talent.service';

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
    const request = req.body as UploadTalentRequest[];

    const talents = await uploadTalents(request);

    res.send(talents);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Backdoor for Updating Talent Points
 */
TalentRoute.post('/talents/backdoor', async (req, res) => {
  try {
    const request = req.body as BackdoorTalentRequest;
    await addTalentPoints(request);

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
})

export default TalentRoute;