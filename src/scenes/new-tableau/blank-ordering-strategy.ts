import { Card } from "../../card-shoe/cards/card";
import { CardAnchor } from "./card-anchor";
import { OrderingStrategy } from "./ordering-strategy";

export class BlankOrderingStrategy implements OrderingStrategy {
  accepts(_anchor: CardAnchor, _card: Card): boolean {
    return false
  }
}