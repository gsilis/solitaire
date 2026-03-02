import { Card } from "../../card-shoe/cards/card";

export interface OrderingStrategy {
  accepts(card: Card): boolean
}