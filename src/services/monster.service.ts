import { Types } from "mongoose";
import { throwError } from "../helpers/error.helper";
import { convertToDetailedMonsterResponse, validateSearchCriteria } from "../helpers/monster.helper";
import { convertToNumberElement } from "../helpers/skill.helper";
import { MonsterModel } from "../models/core/monster.model";
import { SearchMonsterRequest } from "../models/requests";
import { UploadMonsterRequest } from "../models/requests/upload-monster.request";
import { UploadSpriteRequest } from "../models/requests/upload-sprite.request";
import { DetailedMonsterResponse } from "../models/responses/detailed-monster.response";
import { StarterGroupResponse } from "../models/responses/starter-group.response";
import { IDetailedMonster, IDetailedMonsterDocument } from "../mongo/interfaces";
import { IMonsterDocument } from "../mongo/interfaces/monster.interface";
import { Account, CardInventory, DetailedMonster, Evolution } from "../mongo/models";
import Monster from "../mongo/models/monster";
import Skill from "../mongo/models/skill";
import config from "../shared/config";
import { EvolutionEnum, starterGroups } from "../shared/constants";
import { getCard } from "./card.service";

/**
 * Get All Monsters
 * @returns Monster Array
 */
export async function getMonsters(): Promise<IMonsterDocument[]> {
  try {
    const monsters = await Monster.find().populate('skills');

    return monsters
  } catch (error) {
    throw error
  }
}

/**
 * Get Monster By Id
 * @param id Monster Id
 * @returns Monster
 */
export async function getMonster(id: string): Promise<IMonsterDocument> {
  try {
    const monster = await Monster.findById(id).populate('skills');

    return monster
  } catch (error) {
    throw error
  }
}
 
/**
 * Upload Monsters base data
 * @param request Monster data
 */
export async function uploadMonsters(request: UploadMonsterRequest[]): Promise<IMonsterDocument[]> {
  const session = await Monster.startSession();
  session.startTransaction();

  try {
    await Monster.deleteMany();

    const allSkills = await Skill.find();

    const monsters: MonsterModel[] = [];
    request.forEach(r => {
      const skills = allSkills.filter(s => r.skills.includes(s.name)).map(s => s.id)

      const monster: MonsterModel = {
        baseStats: r.stats,
        element: convertToNumberElement(r.element),
        name: r.name,
        skills: skills,
        stage: r.stage,
        statGain: r.gains
      }

      if (r.evolution !== '') {
        monster.evolution = r.evolution
      }

      monsters.push(monster);
    });

    const result = await Monster.insertMany(monsters);

    return result
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}

/**
 * Upload Sprites and Update Monster Data
 */
export async function uploadMonsterSprites(request: UploadSpriteRequest[]): Promise<IMonsterDocument[]> {
  const session = await Monster.startSession();
  session.startTransaction();

  try {
    const monsters = await Monster.find();
    monsters.forEach(async (m) => {
      const relatedMonster = request.find(r => r.name === m.name);

      m.sprite = {
        attack: relatedMonster.attack,
        dead: relatedMonster.dead,
        dimensions: {
          height: relatedMonster.dimensions.height,
          scale: relatedMonster.scale,
          width: relatedMonster.dimensions.width
        },
        hit: relatedMonster.hit,
        idle: relatedMonster.idle,
        name: relatedMonster.name,
        ultimate: relatedMonster.ultimate,
        win: relatedMonster.win
      }

      await m.save();
    })

    return monsters;
  } catch (error) {
    session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Get Monster Starter Group
 */
export async function getStarterGroups(): Promise<StarterGroupResponse[]> {
  try {
    const rookies = await Monster.find({ stage: EvolutionEnum.ROOKIE })
                            .select('name element -_id');

    const groups: StarterGroupResponse[] = [];
    starterGroups.forEach(g => {
      const group: StarterGroupResponse = new StarterGroupResponse();
      group.group = g.group;
      group.monsters = []

      g.monsters.forEach(m => {
        group.monsters.push(rookies.find(r => r.name === m));
      })

      groups.push(group);
    })

    return groups;
  } catch (error) {
    throw error
  }
}

/**
 * Add Requested Monsters to Account
 * @param accountId Account Id
 * @param request request monster ids
 */
export async function addMonsterToAccount(accountId: string, request: string[]): Promise<IDetailedMonsterDocument[]> {
  try {
    // base monster model
    const baseMonster: IDetailedMonster = {
      accountId: new Types.ObjectId(accountId),
      currentExp: 0,
      level: 1,
      talentPoints: 1,
      talents: [],
      cardBonus: 0
    }

    const ids = request.map(r => new Types.ObjectId(r));
    const monsterDocuments = await Monster.find({ _id: { $in: ids } })

    const monsters: IDetailedMonster[] = [];
    request.forEach(r => {
      const document = monsterDocuments.find(d => d.id == r)
      monsters.push({
        ...baseMonster,
        monster: document._id
      });
    })

    const result = await DetailedMonster.insertMany(monsters);

    // add to account's unlocked list
    const account = await Account.findById(accountId);
    if (!account) {
      throwError(400, 'Invalid Account');
    }

    const unlistedMonsters = monsterDocuments.map(md => md.name).filter(md => !account.unlockedMonsters.includes(md))
    if (unlistedMonsters.length > 0) {
      await Account.findByIdAndUpdate(accountId, { $push: { unlockedMonsters: { $each: unlistedMonsters } } })
    }
    
    return result;
  } catch (error) {
    throw error
  }
}

/**
 * Fetches all monsters owned by the account
 * @param accountId Account Id
 */
export async function getAccountMonsters(accountId: string, criteria: SearchMonsterRequest): Promise<DetailedMonsterResponse[]> {
  try {
    validateSearchCriteria(criteria);

    const id = new Types.ObjectId(accountId);

    const documents = await DetailedMonster.find({ accountId: id })
                            .populate('monster', '-evolution -__v -skills -sprite');

    const monsters = documents.map(d => convertToDetailedMonsterResponse(d))

    return monsters;
  } catch (error) {
    throw error
  }
}

/**
 * Evolves Monster to its next Stage
 * @param accountId Account Id
 * @param monsterId Monster Id
 */
export async function evolveMonster(accountId: string, monsterId: string): Promise<DetailedMonsterResponse> {
  const session = await DetailedMonster.startSession();
  session.startTransaction();

  try {
    const usedSession = config.environment === 'production' ? session : null

    const requestedMonster = await DetailedMonster
                            .findOne({ accountId: new Types.ObjectId(accountId), _id: new Types.ObjectId(monsterId) })
                            .populate('monster')
    if (!requestedMonster) {
      throwError(404, 'Monster not found')
    }

    const { name, evolution, stage } = requestedMonster.monster as IMonsterDocument;

    // validate if monster can still undergo evolution
    if (!evolution) {
      throwError(400, 'Monster can no longer evolve')
    }

    const cardInventory = await getCard(accountId, name);
    const monsterCard = cardInventory.cards[0];

    const evolutionStage = await Evolution.findOne({ name: stage })
    const monsterEvolution = await Monster.findOne({ name: evolution });

    // validate amount of monster card
    if (monsterCard.quantity < evolutionStage.cardPrerequisite) {
      throwError(400, 'Insufficient Monster Cards')
    }

    await DetailedMonster.findByIdAndUpdate(monsterId, { $set: { monster: monsterEvolution._id } }, { session: usedSession })
    await CardInventory.updateOne({ _id: cardInventory.id, 'cards.monsterName': name },
                                  {
                                    $inc: { 'cards.$.quantity': -evolutionStage.cardPrerequisite }
                                  },
                                  { session: usedSession })

    const account = await Account.findById(accountId);
    if (!account.unlockedMonsters.includes(monsterEvolution.name)) {
      account.unlockedMonsters.push(monsterEvolution.name);

      await account.save();
    }

    const updatedMonster = await DetailedMonster.findById(monsterId).populate('monster')

    return convertToDetailedMonsterResponse(updatedMonster);
  } catch (error) {
    throw error
  }
}

/**
 * Apply Card Bonuses
 * @param accountId Monster Id
 * @param monsterId Account Id
 */
export async function applyCardBonus(accountId: string, monsterId: string): Promise<DetailedMonsterResponse> {
  const session = await DetailedMonster.startSession();
  session.startTransaction();

  try {
    const usedSession = config.environment === 'production' ? session : null;
    const requestedMonster = await DetailedMonster
                            .findOne({ accountId: new Types.ObjectId(accountId), _id: new Types.ObjectId(monsterId) })
                            .populate('monster')
    if (!requestedMonster) {
      throwError(404, 'Monster not found')
    }

    const { name, stage } = requestedMonster.monster as IMonsterDocument;
    const allowedEvolutions = [EvolutionEnum.MEGA, EvolutionEnum.ULTRA] as string[]
    if (!allowedEvolutions.includes(stage)) {
      throwError(400, 'Card Bonus Not Applicable to Monster');
    }

    const evolutionStage = await Evolution.findOne({ name: stage })
    if (evolutionStage.maxCardBonus <= requestedMonster.cardBonus) {
      throwError(400, 'Card Bonus is already maxed out')
    }

    const cardInventory = await getCard(accountId, name);
    const monsterCard = cardInventory.cards[0];
    // validate amount of monster card
    if (monsterCard.quantity < 1) {
      throwError(400, 'Insufficient Monster Cards')
    }

    await DetailedMonster.findByIdAndUpdate(monsterId, { $inc: { cardBonus: 1 } }, { session: usedSession })
    await CardInventory.updateOne({ _id: cardInventory.id, 'cards.monsterName': name },
                                  {
                                    $inc: { 'cards.$.quantity': -1 }
                                  },
                                  { session: usedSession })

    const updatedMonster = await DetailedMonster.findById(monsterId).populate('monster')

    return convertToDetailedMonsterResponse(updatedMonster);
  } catch (error) {
    session.abortTransaction();
    
    throw error
  } finally {
    session.endSession();
  }
}