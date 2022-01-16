import { Router } from "express";
import DictionaryRouter from "./dictionary.route";
import EvolutionRouter from "./evolutions.route";
import ItemsRouter from "./items.route";
import MonsterRouter from "./monster.route";
import SkillRoute from "./skills.route";
import TalentRoute from "./talents.route";
import UserRouter from "./user.route";

const routes: Router[] = [];

routes.push(SkillRoute);
routes.push(TalentRoute);
routes.push(DictionaryRouter);
routes.push(EvolutionRouter);
routes.push(ItemsRouter);
routes.push(MonsterRouter);
routes.push(UserRouter);

export default routes;