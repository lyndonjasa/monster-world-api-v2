import { Router } from "express";
import DictionaryRouter from "./dictionary.route";
import EvolutionRouter from "./evolutions.route";
import ItemsRouter from "./items.route";
import MonsterRouter from "./monster.route";
import SkillRoute from "./skills.route";
import TalentRoute from "./talents.route";

const routes: Router[] = [];

routes.push(SkillRoute);
routes.push(TalentRoute);
routes.push(DictionaryRouter);
routes.push(EvolutionRouter);
routes.push(ItemsRouter);
routes.push(MonsterRouter);

export default routes;