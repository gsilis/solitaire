import { ACE, EIGHT, FIVE, FOUR, JACK, KING, NINE, QUEEN, SEVEN, SIX, TEN, THREE, TWO } from "../card-shoe/cards/card";
import { AcceptCardStrategy } from "./accept-card-strategy";
import { CardObject } from "./card-object";

const ACCEPT = [
  KING, QUEEN, JACK, TEN, NINE, EIGHT, SEVEN, SIX, FIVE, FOUR, THREE, TWO, ACE
]

export class AlternatingColorStrategy implements AcceptCardStrategy {
  acceptCard(tree: CardObject[], card: CardObject): boolean {
    const lastCard = [...tree].pop() as CardObject
    const lastCardIndex = ACCEPT.indexOf(lastCard?.value || '')
    const nextCardValue = ACCEPT[lastCardIndex + 1]
    const differentColors = lastCard?.isRed !== card?.isRed

    if (!lastCard && card.value === KING) {
      return true
    } else if (nextCardValue && card?.value === nextCardValue && differentColors) {
      return true
    } else {
      return false
    }
  }
}