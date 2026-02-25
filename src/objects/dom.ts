import { GameData } from "../data/game-data"

let dom: Dom

const game = GameData.getInstance()

export class Dom {
  private constructor() {}

  static getInstance() {
    if (!dom) {
      dom = new Dom()
    }

    return dom
  }

  get root(): HTMLElement {
    const uiRoot = document.querySelector('.ui')
    const state = game.state
    const element = uiRoot?.querySelector<HTMLElement>(`#${state}`)

    if (element && element.style.display !== 'none') {
      return element
    } else {
      console.warn('Placeholder DOM element returned!')
      return document.createElement('div')
    }
  }
}