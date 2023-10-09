export default class InputSystem {
  private _game!: Phaser.Scene;
  // private _plugin!: Phaser.Input.Keyboard.KeyboardPlugin;
  private _keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

  constructor(game: Phaser.Scene) {
    this._game = game;

    this._keys.left = this._game.input.keyboard.addKey(65);
    this._keys.right = this._game.input.keyboard.addKey(68);
  }

  get left() {
    return this._keys.left;
  }

  get right() {
    return this._keys.right;
  }
}
