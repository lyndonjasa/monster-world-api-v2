import { Router } from "express";
import AccountRouter from "./account.route";
import DictionaryRouter from "./dictionary.route";
import DungeonRouter from "./dungeon.route";
import EventRouter from "./events.route";
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
routes.push(DungeonRouter);
routes.push(AccountRouter);
routes.push(EventRouter);

export default routes;