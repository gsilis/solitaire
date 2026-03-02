import { Actor, Color, Engine, Rectangle, TextAlign } from "excalibur";
import { Factories } from "./factories";

const factory = Factories.getInstance()

export class IndexGraphic extends Actor {
  private _label = factory.labelFactory.create('', TextAlign.Center)
  private _color = Color.Black

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.setup()
  }

  get col() { return this._color }
  set col(color: Color) { this._color = color; this.setup() }

  override onAdd(engine: Engine): void {
    super.onAdd(engine)

    this.addChild(this._label)
  }

  override onRemove(engine: Engine): void {
    super.onRemove(engine)

    this.addChild(this._label)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this._label.text = `${this.z}`
  }

  private setup() {
    this.graphics.use(new Rectangle({
      width: 300,
      height: 100,
      color: this._color,
    }))
  }
}