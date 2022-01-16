export interface ISpriteAnimation {
  start: number;
  end: number;
  layer: number;
  speed: number;
}

export interface ISprite {
  name: string;
  dimensions: {
    scale: number;
    width: number;
    height: number;
  }
  idle: ISpriteAnimation,
  attack: ISpriteAnimation,
  ultimate: ISpriteAnimation,
  hit: ISpriteAnimation,
  dead: ISpriteAnimation,
  win: ISpriteAnimation
}