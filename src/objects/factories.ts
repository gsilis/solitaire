import { CARD_FONT, CONTROL_FONT, TITLE_FONT } from "../data/fonts"
import { LabelFactory } from "../factories/label-factory"
import { SuitFactory } from "../factories/suit-factory"

let instance: Factories

export class Factories {
  labelFactory = new LabelFactory(CARD_FONT)
  titleFactory = new LabelFactory(TITLE_FONT)
  controlFactory = new LabelFactory(CONTROL_FONT)
  suitFactory = new SuitFactory()

  private constructor() {}

  static getInstance() {
    if (!instance) {
      instance = new Factories()
    }

    return instance
  }
}