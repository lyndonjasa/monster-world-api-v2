import { DetailedMonsterResponse } from "../models/responses/detailed-monster.response";
import { IDetailedMonsterDocument, IMonsterDocument, ISkillDocument } from "../mongo/interfaces";
import { EvolutionEnum } from "../shared/constants";
import { calculateStats } from "./stat.helper";

export function convertToDetailedMonsterResponse(document: IDetailedMonsterDocument): DetailedMonsterResponse {
  const m = document.monster as IMonsterDocument;
  const bonusIndicator = document.cardBonus > 0 ? ` +${document.cardBonus}` : ''

  const monster: DetailedMonsterResponse = {
    _id: document.id,
    currentExp: document.currentExp,
    element: m.element,
    expToLevel: 10, // TODO: replace this with actual value from exp table
    level: document.level,
    name: m.name + bonusIndicator,
    skills: m.skills ? m.skills as ISkillDocument[] : undefined,
    sprite: m.sprite,
    talents: document.talents,
    talentPoints: document.talentPoints,
    stats: calculateStats(m.baseStats, m.statGain, document.level, document.talents, document.cardBonus, m.stage)
  }

  return monster;
}