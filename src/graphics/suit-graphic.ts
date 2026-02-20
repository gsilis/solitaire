import { Actor, Engine, Sprite, SpriteSheet } from "excalibur";
import { Resources } from "../resources";

export abstract class SuitGraphic extends Actor {
  private _sheet = SpriteSheet.fromImageSource({
    image: Resources.Suit,
    grid: {
      rows: 2,
      columns: 2,
      spriteWidth: 64,
      spriteHeight: 64,
    }
  })

  get sprite() {
    return this._sheet
  }

  get suitGraphic() {
    return this.sprite.getSprite(...this.spriteCoordinates)
  }

  abstract get spriteCoordinates(): [number, number]

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)
    this.graphics.use(this.suitGraphic)
  }
}