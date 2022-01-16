import { ISpriteAnimation } from "../../mongo/interfaces/sprite.interface";

export class UploadSpriteRequest {
  name: string;
  scale: number;
  dimensions: {
    width: number;
    height: number;
  }
  idle: ISpriteAnimation;
  attack: ISpriteAnimation;
  ultimate: ISpriteAnimation;
  hit: ISpriteAnimation;
  dead: ISpriteAnimation;
  win: ISpriteAnimation;
}