// maybe some log key pushes ??

export default class InputSystem {
  private game: Phaser.Game;
  private keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

  constructor(game: Phaser.Game) {
    this.game = game;

    this.keys.left = this.game.input.keyboard.addKey(65);
    this.keys.right = this.game.input.keyboard.addKey(68);
    // this.keys.pause = this.game.input.keyboard.addKey(80);
  }

  get left() {
    return this.keys.left;
  }

  get right() {
    return this.keys.right;
  }

  // get pause(){
  //   return this.keys.pause;
  // }
}
