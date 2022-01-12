import { Router } from "express";
import SkillRoute from "./skills.route";

const routes: Router[] = [];

routes.push(SkillRoute);

export default routes;