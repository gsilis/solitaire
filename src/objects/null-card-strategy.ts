import { AcceptCardStrategy } from "./accept-card-strategy";
import { CardObject } from "./card-object";

export class NullCardStrategy implements AcceptCardStrategy {
  acceptCard(_tree: CardObject[], _card: CardObject): boolean {
    return false
  }
}