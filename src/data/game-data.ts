import Alpine from "alpinejs"
import { Shoe } from "../card-shoe/shoe"

let gameData: GameData

export class State {
  static INITIAL = 'initial'
  static MAIN_MENU = 'main_menu'
  static PLAYING = 'playing'
  static GAME_OVER_ANIMATING = 'game_over_animating'
  static GAME_OVER = 'game_over'
}

export class GameData {
  shoe = new Shoe(1)
  _dealCount = 3
  _state: State = State.INITIAL

  private constructor() {}

  static getInstance() {
    if (!gameData) {
      Alpine.store('game', new GameData())
      gameData = Alpine.store('game') as GameData
    }

    return gameData
  }

  get state() {
    return this._state
  }

  set state(newState: State) {
    this._state = newState
  }

  get isMainMenu() {
    return this.state === State.MAIN_MENU
  }

  get isPlaying() {
    return this.state === State.PLAYING
  }

  get dealOne() {
    return this.dealCount === 1
  }

  get dealThree() {
    return this.dealCount === 3
  }

  get dealCount() {
    return this._dealCount
  }

  set dealCount(value: number) {
    // @ts-ignore
    const cast = parseInt(value)
    this._dealCount = cast
  }

  get isGameOverAnimating() {
    return this.state === State.GAME_OVER_ANIMATING
  }

  get isGameOver() {
    return this.state === State.GAME_OVER
  }

  shuffle() {
    this.shoe = new Shoe(1)
    this.shoe.shuffle()
  }

  deal() {
    return this.shoe.deal()
  }
}