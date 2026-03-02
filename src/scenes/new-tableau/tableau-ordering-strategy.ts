import { ACE, Card, EIGHT, FIVE, FOUR, JACK, KING, NINE, QUEEN, SEVEN, SIX, TEN, THREE, TWO } from "../../card-shoe/cards/card";
import { CardAnchor } from "./card-anchor";
import { OrderingStrategy } from "./ordering-strategy";

const ORDER = [KING, QUEEN, JACK, TEN, NINE, EIGHT, SEVEN, SIX, FIVE, FOUR, THREE, TWO, ACE]

export class TableauOrderingStrategy implements OrderingStrategy {
  accepts(anchor: CardAnchor, card: Card): boolean {
    const lastCard = anchor.lastCard
    const value = lastCard?.value || ''
    const lastCardPosition = ORDER.indexOf(value)
    const nextCardValue = ORDER[lastCardPosition +  1]

    if (lastCard) {
      return nextCardValue !== undefined && nextCardValue === card.value && card.isRed !== lastCard.isRed
    } else {
      return card.value === KING
    }
  }
}