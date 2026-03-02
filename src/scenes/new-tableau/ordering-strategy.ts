import { Card } from "../../card-shoe/cards/card";
import { CardAnchor } from "./card-anchor";

export interface OrderingStrategy {
  accepts(anchor: CardAnchor, card: Card): boolean
}