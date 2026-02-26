import { Color, Engine, Scene, SceneActivationContext } from "excalibur";
import { GameData, State } from "../data/game-data";
import { Dom } from "../objects/dom";
import { CardAnimation } from "../objects/card-animation";

const game = GameData.getInstance()
const ui = Dom.getInstance()

export class MenuScene extends Scene {
  backgroundColor = Color.Azure

  private startButton: HTMLButtonElement | null = null
  private cardAnimation: CardAnimation = new CardAnimation()
  private offset: number = 0
  private time: number = 0

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context);

    game.state = State.MAIN_MENU
    this.add(this.cardAnimation)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.time += elapsed
    this.offset = 5 * Math.sin((this.time / 2000) * (10 / Math.PI))
    
    if (!this.startButton) {
      this.startButton = ui.root.querySelector<HTMLButtonElement>('#play-game')
      this.startButton?.addEventListener('click', this.onPlay)
    }

    const position = engine.screenToWorldCoordinates(engine.screen.center)
    position.y -= (100 + this.offset)
    this.cardAnimation.pos = position
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    if (this.startButton) {
      this.startButton.removeEventListener('click', this.onPlay)
    }
    this.startButton = null
    this.remove(this.cardAnimation)
  }

  private onPlay = () => {
    this.engine.goToScene('table')
  }
}