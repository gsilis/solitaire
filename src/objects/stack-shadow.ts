import { Actor, Engine, Sprite } from "excalibur";
import { Resources } from "../resources";

export class StackShadow extends Actor {
  private _selected: boolean = false
  private _sprite?: Sprite

  onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this._sprite = Resources.CardShade.toSprite()
    this.graphics.use(this._sprite)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    if (this.selected) {
      this.actions.repeatForever((ctx) => {
        ctx.blink(50, 50)
      })
    }
  }

  get selected() { return this._selected }
  set selected(value: boolean) { this._selected = value }
}