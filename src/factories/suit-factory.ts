import * as CardShoe from "card-shoe";
import { type Suit } from "card-shoe";
import { ClubGraphic } from "../graphics/club-graphic";
import { SpadeGraphic } from "../graphics/spade-graphic";
import { DiamondGraphic } from "../graphics/diamond-graphic";
import { HeartGraphic } from "../graphics/heart-graphic";

const { DIAMOND, CLUB, SPADE, HEART } = CardShoe

export class SuitFactory {
  private mapping = {
    [CLUB]: ClubGraphic,
    [SPADE]: SpadeGraphic,
    [DIAMOND]: DiamondGraphic,
    [HEART]: HeartGraphic,
  }

  create(suit: Suit) {
    const SuitClass = this.mapping[suit]
    const instance = new SuitClass()

    return instance
  }
}