import { Actor, Color, Engine, ExcaliburGraphicsContext, Label, vec } from "excalibur";

export class ButtonBackdrop extends Actor {
  private _connectedCmponent?: Label

  get connectedComponent() { return this._connectedCmponent }
  set connectedCompoennt(component: Label | undefined) {
    this._connectedCmponent = component

    if (component instanceof Label) {
      this.graphics.onPreDraw = this.onLabelDraw
    } else {
      this.graphics.onPreDraw = this.nullDraw
    }
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)
  }

  private nullDraw = (context: ExcaliburGraphicsContext) => {
    context.clear()
  }

  private onLabelDraw = (context: ExcaliburGraphicsContext) => {
    context.clear()
    if (!this.connectedCompoennt) return
    const label = this.connectedCompoennt as Label
    const width = label.getTextWidth()
    const height = label.font.size + 10

    this.drawRoundedRectangleAt(context, label.pos.x, label.pos.y, width, height)
  }

  private drawRoundedRectangleAt(context: ExcaliburGraphicsContext, x: number, y: number, width: number, height: number) {
    const topLeft = vec(x + 5, y + 5)
    const topRight = vec(x + width - 5, y + 5)
    const bottomLeft = vec(x + 5, y + height - 5)
    const bottomRight = vec(x + width - 5, y + height - 5)

    context.drawCircle(topLeft, 5, Color.Black)
    context.drawCircle(topRight, 5, Color.Black)
    context.drawCircle(bottomLeft, 5, Color.Black)
    context.drawCircle(bottomRight, 5, Color.Black)
    context.drawRectangle(vec(5, 0), width - 10, height, Color.Black)
    context.drawRectangle(vec(0, 5), width, height - 10, Color.Black)
  }
}