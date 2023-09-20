
export default class LevelManager {
  private _game: Phaser.Scene;
  private _level: number;
  private _levelTimer: Phaser.Time.TimerEvent;
  private _timeForLevel: number;
  public levelLabel: Phaser.GameObjects.Bitmaptext;


  constructor(game: Phaser.Scene, level: number = 1, timeLevel: number = 30000) {
  	this._game = game;
    this._level = level;
    this._timeForLevel = timeLevel;
    this.levelLabel = this._game.add.bitmapText(100, -100, 'arial-stroke','Level ' + String(this._level)).setScale(3.0);

    this.initLevelTimer();
  }

  private initLevelTimer(): void{
    this._levelTimer = this._game.time.addEvent({
      delay: this._timeForLevel,
      callback: this._game.newLevelCallback,
      callbackScope: this._game,
      repeat: -1, 
    });
  }

  // for pause popup not implemented yet
  public togglePauseLevelTimer(): void{
    this._levelTimer.paused = !this._levelTimer.paused;
  }

  public initLevelAnimation(): void{
    this._game.tweens.add({
      targets: this.levelLabel,
      y: Math.floor(this._game.scale.height/2),
      duration: 1000,
      ease: 'Linear', 
      onComplete: () => {
        this._game.time.delayedCall(1000, ()=> this.levelLabel.y = -100);
      },
    });
  }

  get level(){
    return this._level;
  }

  set level(value: number){
    this._level = value;
    this.levelLabel.setText('Level ' + String(this._level));
    this.initLevelAnimation();  
  }


}

