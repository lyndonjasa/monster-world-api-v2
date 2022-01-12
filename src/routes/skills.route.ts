import express from 'express'
import { getSkills } from '../services/skills.service';

const SkillRoute = express.Router();

SkillRoute.get('/skills', async (_, res) => {
  try {
    const skills = await getSkills();

    res.send(skills);
  } catch (error) {
    res.status(500).send(error);
  }
})

export default SkillRoute;