import { Card } from "../../card-shoe/cards/card";
import { OrderingStrategy } from "./ordering-strategy";

export class BlankOrderingStrategy implements OrderingStrategy {
  accepts(_card: Card): boolean {
    return false
  }
}