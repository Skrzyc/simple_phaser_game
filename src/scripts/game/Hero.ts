import { animList } from "./systems/animations";

export type animType =
  | "stand"
  | "goLeft"
  | "goRight"
  | "sliceUp"
  | "sliceLeft"
  | "sliceRight";
export type animData = { key: animType; prior: number; sound?: string };

const alignArcade = (screen: number, fract: number) => {
  return Math.floor(screen * fract);
};

export default class Hero {
  private _game: Phaser.Scene;
  public sprite: Phaser.Physics.Arcade.Sprite;

  private _speed!: number;
  private _currentAnim: animData;

  constructor(game: Phaser.Scene) {
    this._game = game;
    this.sprite = this._game.physics.add
      .sprite(0, 0, "GameAtlas", "knight/knight iso char_idle_0.png")
      .setScale(3.0);

    this._currentAnim = { key: "stand", prior: 0 };
    this.setSpeed();
    this.initKnightAnimations();
  }

  public alignHero(xFact: number, yFact: number, isLocked: boolean = true) {
    this.sprite.x = alignArcade(this._game.scale.width, xFact);
    this.sprite.y = alignArcade(this._game.scale.height, yFact);
    if (isLocked) {
      this.setSpeed(0);
      setTimeout(() => {
        this.setSpeed();
      }, 2000);
    }
  }

  private initKnightAnimations(): void {
    for (const anim of animList) {
      this._game.anims.create({
        key: anim.name,
        frameRate: anim.frameRate,
        repeat: anim.repeat,
        frames: this._game.anims.generateFrameNames("GameAtlas", {
          prefix: anim.prefix,
          suffix: ".png",
          start: anim.start,
          end: anim.end,
        }),
      });
    }
  }

  private setSpeed(value: number = this._game.scale.width / 100) {
    this._speed = value;
  }

  public sliceType(
    object: Phaser.Physics.Arcade.Sprite,
    hero: Phaser.Physics.Arcade.Sprite
  ) {
    var key: animType;
    if (object.y > hero.y) {
      key = object.x > hero.x ? "sliceRight" : "sliceLeft";
    } else {
      key = "sliceUp";
    }
    this.handleAnimation({ key: key, prior: 3 });
  }

  public moveLeft(): void {
    this.handleAnimation({ key: "goLeft", prior: 1 });
    if (this.sprite.x < 0) {
      this.sprite.x = this._game.scale.width;
    } else {
      this.sprite.x -= this._speed;
    }
  }

  public moveRight(): void {
    this.handleAnimation({ key: "goRight", prior: 1 });
    if (this.sprite.x > this._game.scale.width) {
      this.sprite.x = 0;
    } else {
      this.sprite.x += this._speed;
    }
  }

  public handleAnimation(anim: animData): void {
    if (this._currentAnim.prior <= anim.prior) {
      this.animate(anim);
    } else if (!this.sprite.anims.isPlaying) {
      this.animate(anim);
    }
  }

  private animate(anim: animData): void {
    this._currentAnim = anim;
    this.sprite.anims.play(anim.key, true);

    if (anim.sound) {
      this._game.sound.play(anim.sound);
    }
  }
}
