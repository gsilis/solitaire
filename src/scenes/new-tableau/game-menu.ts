import { Engine } from "excalibur";
import { Dom } from "../../objects/dom";
import { GameData } from "../../data/game-data";

const ui = Dom.getInstance()
const game = GameData.getInstance()

export class GameMenu {
  private _setup = false
  private quitButton: HTMLButtonElement | null = null
  private redealButton: HTMLButtonElement | null = null
  private resetButton: HTMLButtonElement | null = null
  private engine?: Engine
  private onQuit?: () => void
  private onReset?: () => void
  private onRedeal?: () => void

  enabled = true

  setup(engine: Engine, onQuit: () => void, onRedeal: () => void, onReset: () => void) {
    if (this._setup) return

    this.engine = engine
    this.onQuit = onQuit
    this.onReset = onReset
    this.onRedeal = onRedeal

    if (!this.quitButton) {
      this.quitButton = ui.root.querySelector<HTMLButtonElement>('#quit-button')
      this.quitButton?.addEventListener('click', this.onQuitClick)
    }
    if (!this.redealButton) {
      this.redealButton = ui.root.querySelector<HTMLButtonElement>('#redeal-button')
      this.redealButton?.addEventListener('click', this.onRedealClick)
    }
    if (!this.resetButton) {
      this.resetButton = ui.root.querySelector<HTMLButtonElement>('#reset-button')
      this.resetButton?.addEventListener('click', this.onRestartClick)
    }

    if (this.quitButton && this.redealButton && this.resetButton) {
      this._setup = true
    }
  }

  teardown() {
    if (this.quitButton) {
      this.quitButton.removeEventListener('click', this.onQuitClick)
      this.quitButton = null
    }

    if (this.redealButton) {
      this.redealButton.removeEventListener('click', this.onRedealClick)
      this.redealButton = null
    }

    if (this.resetButton) {
      this.resetButton.removeEventListener('click', this.onRestartClick)
      this.resetButton = null
    }

    this._setup = false
  }

  private onQuitClick = () => {
    if (!this.enabled) return
    this.onQuit && this.onQuit()
    this.engine?.goToScene('menu')
  }

  private onRedealClick = () => {
    if (!this.enabled) return
    game.plays += 1
    game.attempts = 1
    this.onRedeal && this.onRedeal()
  }

  private onRestartClick = () => {
    if (!this.enabled) return
    game.attempts += 1
    this.onReset && this.onReset()
  }
}