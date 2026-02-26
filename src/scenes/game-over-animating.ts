import { Color, Scene, SceneActivationContext } from "excalibur";
import { Card } from "../card-shoe/cards/card";
import { GameData, State } from "../data/game-data";

const game = GameData.getInstance()

export class GameOverAnimating extends Scene {
  private cardOrder: Card[][] = []
  backgroundColor = Color.fromHex('#146e2d')

  onActivate(context: SceneActivationContext<Card[][], undefined>): void {
    super.onActivate(context)

    game.state = State.GAME_OVER_ANIMATING
    
    if (context.data) {
      this.cardOrder = context.data
    }

    // TODO implement animation
    console.log('Can animate cards', this.cardOrder)
    context.engine.goToScene('gameOver')
  }

  onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.cardOrder = []
  }
}