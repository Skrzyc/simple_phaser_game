const preSufString = (prefix: string, suffix: string, value: string) => {
  return prefix + value + suffix;
};
const randint = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export type atlasConfigData = { key: string; prefix: string; suffix: string };
export type levelConfig = {
  minGap: number;
  levelTextures: string[];
  fruitSpeed: number;
  rotateSpeed: number;
};

export default class FruitManager {
  private _game!: Phaser.Scene;
  private _group!: Phaser.GameObjects.Group;

  private _currentLevel!: number;
  private _levelConfig!: levelConfig;

  private readonly _textures: string[];
  private readonly _atlasConfig: atlasConfigData;
  private readonly _offSet: number = 200;

  constructor(
    game: Phaser.Scene,
    startLevel: number,
    textures: string[],
    config: atlasConfigData
  ) {
    this._game = game;
    this._group = this._game.add.group();

    this._atlasConfig = config;
    this._textures = textures;

    this._currentLevel = startLevel;
    this.initLevelConfig(this._currentLevel);

    this.createFruits();
  }

  private initLevelConfig(level: number): void {
    var howManyTypes = Math.min(this._textures.length, 1 + level);
    var minGap = Math.max(100, 300 - 25 * level);
    var fruitSpeed = Math.min(0.003, level * 0.05) * this._game.scale.height;
    var rotateSpeed = randint(1, 6);
    let tList: string[] = [];
    for (let i = 0; i < howManyTypes; i++) {
      tList.push(this._textures[i]);
    }

    this._levelConfig = {
      minGap: minGap,
      levelTextures: tList,
      fruitSpeed: fruitSpeed,
      rotateSpeed: rotateSpeed,
    };
  }

  private randomTexture(list: string[]): string {
    return list[randint(0, list.length)];
  }

  private createFruits(): void {
    var gap: number = -100;
    for (let i = 0; i < 100; i++) {
      gap -= randint(
        this._levelConfig.minGap,
        this._levelConfig.minGap + randint(0, 50)
      );
      this.addFruit(
        randint(this._offSet, this._game.scale.width - this._offSet),
        gap
      );
    }
  }

  private addFruit(
    x: number,
    y: number,
    name: string = this.randomTexture(this._levelConfig.levelTextures)
  ): void {
    var fruit = this._game.physics.add
      .sprite(
        x,
        y,
        this._atlasConfig.key,
        preSufString(this._atlasConfig.prefix, this._atlasConfig.suffix, name)
      )
      .setScale(3.0);
    this._group.add(fruit);
  }

  public verify(hei: number): boolean {
    let gr = this._group.getChildren();
    if (gr[0].y >= hei) {
      return true;
    } else {
      return false;
    }
  }

  public updateFruits(): void {
    this.group.incY(this._levelConfig.fruitSpeed);
    this.group.rotate(Phaser.Math.DegToRad(this._levelConfig.rotateSpeed));
  }

  set currentLevel(value: number) {
    this._currentLevel = value;
    this._group.clear(true, true);
    this.initLevelConfig(value);
    this.createFruits();
  }

  get group() {
    return this._group;
  }
}
