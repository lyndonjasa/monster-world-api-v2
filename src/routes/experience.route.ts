import express from 'express';
import { UploadExperienceRequest } from '../models/requests';
import { getExperienceTable, uploadExperinceTable } from '../services/experience.service';

const ExperienceRouter = express.Router();

/**
 * Retrieves the Experience Table
 */
ExperienceRouter.get('/experience', async (_, res) => {
  try {
    const values = await getExperienceTable();

    res.send(values);
  } catch (error) {
    res.status(500).send(error)
  }
});

/**
 * Uploads the Experience Table
 */
ExperienceRouter.post('/experience/upload', async (req, res) => {
  try {
    const request = req.body as UploadExperienceRequest[];
    const result = await uploadExperinceTable(request);

    res.send(result);
  } catch (error) {
    res.status(500).send(error)
  }
})

export default ExperienceRouter