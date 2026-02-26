import Alpine from "alpinejs"
import { Shoe } from "../card-shoe/shoe"
import { Card } from "../card-shoe/cards/card"

let gameData: GameData

export const SCREEN_WIDTH = 1280
export const SCREEN_HEIGHT = 960

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
  _plays = 0
  _attempts = 0
  _wins = 0

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

  get plays() {
    return this._plays
  }

  set plays(value: number) {
    this._plays = value
  }

  get attempts() {
    return this._attempts
  }

  set attempts(value: number) {
    this._attempts = value
  }

  get wins() {
    return this._wins
  }

  set wins(value: number) {
    this._wins = value
  }

  shuffle() {
    this.shoe = new Shoe(1)
    this.shoe.shuffle()
  }

  reset(cards: Card[]) {
    this.shoe.acceptSnapshot(cards)
  }

  deal() {
    return this.shoe.deal()
  }
}