import { Shoe } from "../card-shoe/shoe"
import { LabelFactory } from "../factories/label-factory"
import { SuitFactory } from "../factories/suit-factory"
import { CARD_FONT } from "./fonts"

let gameData: GameData

export class GameData {
  labelFactory = new LabelFactory(CARD_FONT)
  suitFactory = new SuitFactory()
  shoe = new Shoe(1)

  private constructor() {}

  public static getInstance() {
    if (!gameData) {
      gameData = new GameData()
    }

    return gameData
  }

  shuffle() {
    this.shoe = new Shoe(1)
  }
}