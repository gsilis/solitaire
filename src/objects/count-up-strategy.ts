import { ACE, EIGHT, FIVE, FOUR, JACK, KING, NINE, QUEEN, SEVEN, SIX, TEN, THREE, TWO } from "../card-shoe/cards/card";
import { AcceptCardStrategy } from "./accept-card-strategy";
import { CardObject } from "./card-object";

const ACCEPTS = [
  ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING
]

export class CountUpStrategy implements AcceptCardStrategy {
  acceptCard(tree: CardObject[], card: CardObject): boolean {
    const lastCard = [...tree].pop()
    const nextCardIndex = ACCEPTS.indexOf(lastCard?.value || '') + 1
    const nextCardValue = ACCEPTS[nextCardIndex]

    if (!lastCard && card?.value === ACE) {
      return true
    } else if (lastCard?.suit === card?.suit && card?.value === nextCardValue) {
      return true
    } else {
      return false
    }
  }
}