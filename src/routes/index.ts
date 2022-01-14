import { Router } from "express";
import SkillRoute from "./skills.route";
import TalentRoute from "./talents.route";

const routes: Router[] = [];

routes.push(SkillRoute);
routes.push(TalentRoute);

export default routes;