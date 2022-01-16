import { ISprite, ISpriteAnimation } from "../../mongo/interfaces/sprite.interface";

export class SpriteModel implements ISprite {
  name: string;
  dimensions: { 
    scale: number; 
    width: number; 
    height: number;
  };
  idle: ISpriteAnimation;
  attack: ISpriteAnimation;
  ultimate: ISpriteAnimation;
  hit: ISpriteAnimation;
  dead: ISpriteAnimation;
  win: ISpriteAnimation;
}