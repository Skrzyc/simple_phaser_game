import { GameDispatch, GameState, ActionAddScore, ActionTakeLife} from './GameContext';
import * as Phaser from 'phaser';
import Align from './systems/Align';
import { PointLike } from './systems/Align';
import SoundSystem from './systems/SoundSystem';
import {PlayConfig} from './systems/SoundSystem';
import InputSystem from './systems/Input';
import LevelManger from './systems/LevelManager';
import FruitManager from './FruitManager';
import Hero from './Hero';


export default class GameScene extends Phaser.Scene {
  private _sounds!: SoundSystem;
  private _keys!: InputSystem;
  private _gameState!: GameState;
  private _level!: LevelManger;

  public fruits!: FruitManager;
  public bg!: Phaser.GameObjects.Sprite;
  public hero!: Hero;

  private _data!: {
    dispatch: GameDispatch;
    initialState: GameState;
  }; 

  private _soundConfig!: PlayConfig;

  static readonly heroStartPos: PointLike = {x: 0.5, y: 0.8};
  static readonly fruitTextures: string[] = ['Apple', 'Avocado', 'Bread', 'Brownie', 'Cheese', 'Cookie', 'MelonHoneydew', 'MelonWater', 'Peach', 'PieLemon', 'Lemon', 'Onion'];
  static readonly isDebugMode: boolean = false;

  toggleMute(){
      this._soundConfig.volume = (this._soundConfig.volume==1)?(0):(1);
  }

  collectItem(hero: Phaser.Physics.Arcade.Sprite, object: Phaser.Physics.Arcade.Sprite): void{
      this.hero.sliceType(object, hero);
      // prevents from mulitple trigers by event emitter, cause object is set to be destoryed with the delay to achieve smooth gameplay
      object.disableBody(); 
      setTimeout(() => {
        this._sounds.play('collect', this._soundConfig);
        object.destroy();
        this._data.dispatch(new ActionAddScore(10));
        }, 100); 
  }

  newLevelCallback(): void{ 
      this._level.level += 1;
      this.hero.alignHero(GameScene.heroStartPos.x, GameScene.heroStartPos.y);
      this.fruits.currentLevel = this._level.level;
  }

  updateFruitsCallback(): void{
      this.fruits.updateFruits();
  }

  preload() {
    Align.init(this);

    // load atlasses
    this.load.atlas('GameAtlas', 'atlas/game.webp', 'atlas/game.json');

    // load bitmap fonts
    // this.load.bitmapFont('arial', 'fonts/arial.png', 'fonts/arial.fnt');
    this.load.bitmapFont('arial-stroke', 'fonts/arial-stroke.png', 'fonts/arial-stroke.fnt');

    // load settings
    this.load.json('default-settings', 'settings.json');

    // load sounds
    this.load.audioSprite('sounds', 'audio/sounds.json', 'audio/sounds.mp3');

    //load background
    this.load.image('background', 'bgpixel.jpg', 612, 382);
    }

  create(data: { dispatch: GameDispatch; initialState: GameState }) {
    // TODO: here create elements
    this._data = data;
    this._soundConfig = {loop: false, volume: 1};

    // CREATE INPUTS
    this._keys = new InputSystem(this);
    
    // CREATE BACKGROUND
    this.bg = this.add.image(0, 0, "background");
    Align.fillScreen(this.bg);

    // LEVEL MANAGAER
    this._level = new LevelManger(this);

    // CREATE HERO 
    this.hero = new Hero(this); // Align utils not working on Arcades Sprites  
    this.hero.alignHero(GameScene.heroStartPos.x, GameScene.heroStartPos.y, false);

    // CREATE FRUITS GROUP 
    this.fruits = new FruitManager(this, GameScene.fruitTextures, {key: "GameAtlas", prefix:'fruits/', suffix: '.png'});

    // Overlap fruits with Hero
    this.physics.add.overlap(this.hero.sprite, this.fruits.group, this.collectItem, null, this);
    
    // CREATE EVENTS
    this.events.on('update', this.updateFruitsCallback, this);

    // initialize sounds
    this._sounds = new SoundSystem(this.game, 'sounds'); 

    //initialize scale
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
    this.resize();
  }

  resize() { // fixing hero posY and background on resize
      Align.fillScreen(this.bg);
      this.hero.alignHero(GameScene.heroStartPos.x, GameScene.heroStartPos.y, false);
  }

  update() {
    // this extremly weird syntax eficiently checks also scenario when right and left is down 
    if(this._keys.right.isUp & this._keys.left.isDown){
        this.hero.moveLeft();
    }else if(this._keys.right.isDown & this._keys.left.isUp){
        this.hero.moveRight();
    }else{
        this.hero.handleAnimation({key: 'stand', prior: 0}) 
    }

    // probably better will be setHitArea for the group
    this.fruits.group.getChildren().forEach(child => {
        if(child.y>=this.scale.height){
            this._sounds.play('fail', this._soundConfig);
            child.destroy(); 
            if(!GameScene.isDebugMode){
                this._data.dispatch(new ActionTakeLife());
            }
        }
    });


    }
  // why getter here ?
  get sounds() {
    return this._sounds;
  }

}
