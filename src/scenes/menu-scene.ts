import { Color, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext } from "excalibur";
import { GameData, State } from "../data/game-data";
import { Dom } from "../objects/dom";

const game = GameData.getInstance()
const ui = Dom.getInstance()

export class MenuScene extends Scene {
  backgroundColor = Color.Azure

  private startButton: HTMLButtonElement | null = null

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context);

    game.state = State.MAIN_MENU
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)
    
    if (!this.startButton) {
      this.startButton = ui.root.querySelector<HTMLButtonElement>('#play-game')
      this.startButton?.addEventListener('click', this.onPlay)
    }
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    if (this.startButton) {
      this.startButton.removeEventListener('click', this.onPlay)
    }
    this.startButton = null
  }

  private onPlay = () => {
    this.engine.goToScene('table')
  }
}