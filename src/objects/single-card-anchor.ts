import { CardAnchor } from "./card-anchor";
import { CardObject } from "./card-object";

export class SingleCardAnchor extends CardAnchor {
  acceptCard(_card: CardObject): boolean {
    return false
  }

  yPositionFor(_index: number): number {
    return 0
  }

  xPositionFor(_index: number): number {
    return 0
  }
}