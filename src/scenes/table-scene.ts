import { Color, ExcaliburGraphicsContext, Graph, Scene, SceneActivationContext } from "excalibur";
import { GameData } from "../data/game-data";
import { CardGraphic } from "../graphics/card-graphic";
import { CardSide } from "../data/card-side";
import { times } from "../utils/times";

const game = GameData.getInstance()
const columns = 9
const all = 36

export class TableScene extends Scene {
  private cardGraphics?: CardGraphic[] = []

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)
    this.backgroundColor = Color.Gray
    game.shoe.shuffle()

    times(all).forEach(() => {
      const card = game.shoe.deal()
      if (!card) return
      const graphic = new CardGraphic({ card, face: CardSide.FRONT })
      this.cardGraphics?.push(graphic)
      this.add(graphic)
    })
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)
    this.cardGraphics?.forEach((clip) => {
      this.remove(clip)
    })
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsed: number): void {
    super.onPreDraw(ctx, elapsed)

    this.cardGraphics?.forEach((clip, index) => {
      const row = Math.floor(index / columns)
      const col = index % columns

      clip.pos.x = (col * 128) + 64
      clip.pos.y = (row * 192) + 128
    })
  }
}