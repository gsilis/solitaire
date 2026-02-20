import { ClubGraphic } from "../graphics/club-graphic";
import { SpadeGraphic } from "../graphics/spade-graphic";
import { DiamondGraphic } from "../graphics/diamond-graphic";
import { HeartGraphic } from "../graphics/heart-graphic";
import { CLUB, DIAMOND, HEART, SPADE, Suit } from "../card-shoe/cards/card";

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