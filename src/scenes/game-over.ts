import { Color, Engine, Scene, SceneActivationContext } from "excalibur";
import { GameData, State } from "../data/game-data";
import { Dom } from "../objects/dom";

const game = GameData.getInstance()
const ui = Dom.getInstance()

export class GaemOver extends Scene {
  backgroundColor = Color.fromHex('#146e2d')

  private newGame: HTMLButtonElement | null = null
  private mainMenu: HTMLButtonElement | null = null

  onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    game.state = State.GAME_OVER
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    if (!this.newGame) {
      this.newGame = ui.root.querySelector<HTMLButtonElement>('#new-game')
      this.newGame?.addEventListener('click', this.onNewGameClick)
    }

    if (!this.mainMenu) {
      this.mainMenu = ui.root.querySelector<HTMLButtonElement>('#menu')
      this.mainMenu?.addEventListener('click', this.onMainMenu)
    }
  }

  onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    if (this.newGame) {
      this.newGame.removeEventListener('click', this.onNewGameClick)
      this.newGame = null
    }

    if (this.mainMenu) {
      this.mainMenu.removeEventListener('click', this.onMainMenu)
      this.mainMenu = null
    }
  }

  private onNewGameClick = () => {
    this.engine.goToScene('table')
  }

  private onMainMenu = () => {
    this.engine.goToScene('menu')
  }
}