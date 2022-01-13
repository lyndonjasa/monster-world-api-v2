import express from 'express'
import { UploadSkillRequest } from '../models/requests/upload-skill.request';
import { getSkills, uploadSkills } from '../services/skills.service';

const SkillRoute = express.Router();

/**
 * Get List of Skills
 */
SkillRoute.get('/skills', async (_, res) => {
  try {
    const skills = await getSkills();

    res.send(skills);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Upload and Convert Skills
 */
SkillRoute.post('/skills/upload', (req, res) => {
  try {
    const request = req.body as UploadSkillRequest[]

    const skills = uploadSkills(request);

    res.send(skills);
  } catch (error) {
    res.send(error);
  }
})

export default SkillRoute;