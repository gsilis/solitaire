import { Card } from "../../card-shoe/cards/card";
import { OrderingStrategy } from "./ordering-strategy";

export class PermissiveOrderingStrategy implements OrderingStrategy {
  accepts(_card: Card): boolean {
    return true
  }
}