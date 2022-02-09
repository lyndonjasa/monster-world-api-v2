import { SearchMonsterRequest } from "../models/requests";
import { DetailedMonsterResponse } from "../models/responses/detailed-monster.response";
import { IDetailedMonsterDocument, IMonsterDocument, ISkillDocument } from "../mongo/interfaces";
import { throwError } from "./error.helper";
import { expTable } from "./exp.helper";
import { calculateStats } from "./stat.helper";

export function validateSearchCriteria(criteria: SearchMonsterRequest): void {
  const { page, pageSize, sortProperty, filters, sortDirection } = criteria

  // validate page
  if (isNaN(page) || page < 1) {
    throwError(400, 'Invalid Page value');
  }

  // validate page size
  if (isNaN(pageSize) || pageSize < 1) {
    throwError(400, 'Invalid Page Size value');
  }

  // validate sort property
  const validSortProperties = ['Name', 'Level', 'None'];
  if (!validSortProperties.includes(sortProperty)) {
    throwError(400, `Invalid Sort Property. Allowed values are ${validSortProperties.join(', ')}`)
  }

  const validSortDirections = ['ASC', 'DESC'];
  if (sortDirection && sortProperty !== 'None') {
    if (!validSortDirections.includes(sortDirection.toUpperCase())) {
      throwError(400, `Invalid Sort Direction. Allowed values are ${validSortDirections.join(', ')}`)
    }
  }

  // validate filters
  if (filters) {
    const { elements, stages } = filters

    // validate elements
    if (elements && elements.length > 0) {
      const allowedElements = ['Fire', 'Water', 'Wind', 'Electric', 'Rock', 'NonElemental']
      const invalidElements = elements.filter(e => !allowedElements.includes(e))

      if (invalidElements.length > 0) {
        throwError(400, `Invalid Elements. Allowed values are ${allowedElements.join(', ')}`)
      }
    }

    // validate stages
    if (stages && stages.length > 0) {
      const allowedStages = ['Rookie', 'Champion', 'Ultimate', 'Mega', 'Ultra']
      const invalidStages = stages.filter(s => !allowedStages.includes(s))

      if (invalidStages.length > 0) {
        throwError(400, `Invalid Stages. Allowed values are ${allowedStages.join(', ')}`)
      }
    }
  }
}

export function convertToDetailedMonsterResponse(document: IDetailedMonsterDocument): DetailedMonsterResponse {
  const m = document.monster as IMonsterDocument;
  const bonusIndicator = document.cardBonus > 0 ? ` +${document.cardBonus}` : ''

  const monster: DetailedMonsterResponse = {
    _id: document.id || document._id,
    currentExp: document.currentExp,
    element: m.element,
    expToLevel: getExpToNextLevel(document.currentExp), // TODO: replace this with actual value from exp table
    level: document.level,
    name: m.name,
    computedName: m.name + bonusIndicator,
    skills: m.skills ? m.skills as ISkillDocument[] : undefined,
    sprite: m.sprite,
    talents: document.talents,
    talentPoints: document.talentPoints,
    stats: calculateStats(m.baseStats, m.statGain, document.level, document.talents, document.cardBonus, m.stage),
    stage: m.stage
  }

  return monster;
}

const getExpToNextLevel = (currentExp: number) => {
  const row = expTable.find(e => currentExp >= e.min && currentExp <= e.max);

  return row.max + 1;
}