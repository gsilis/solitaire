import { ExcaliburGraphicsContext, Scene, SceneActivationContext } from "excalibur";
import { GameData } from "../data/game-data";
import { CardGraphic } from "../graphics/card-graphic";

const game = GameData.getInstance()

export class TableScene extends Scene {
  private cardGraphic?: CardGraphic

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)
    const card = game.shoe.deal()
    if (!card) return

    this.cardGraphic = new CardGraphic({ card })
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsed: number): void {
    super.onPreDraw(ctx, elapsed)

    if (this.cardGraphic) {
      this.cardGraphic.pos.x = 100
      this.cardGraphic.pos.y = 100
    }
  }
}