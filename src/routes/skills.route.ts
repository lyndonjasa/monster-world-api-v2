import express from 'express'
import { IUserRequestPayload } from '../models/core/user-request.payload';
import { UploadSkillRequest } from '../models/requests/upload-skill.request';
import { getSkills, uploadSkills } from '../services/skills.service';
import { auth } from '../shared/auth';

const SkillRoute = express.Router();

/**
 * Get List of Skills
 */
SkillRoute.get('/skills', async (req: IUserRequestPayload, res) => {
  console.log(req.user);
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
SkillRoute.post('/skills/upload', async (req, res) => {
  try {
    const request = req.body as UploadSkillRequest[]

    const skills = await uploadSkills(request);

    res.send(skills);
  } catch (error) {
    res.send(error);
  }
})

export default SkillRoute;