import { ACE, Card, EIGHT, FIVE, FOUR, JACK, KING, NINE, QUEEN, SEVEN, SIX, TEN, THREE, TWO } from "../../card-shoe/cards/card";
import { CardAnchor } from "./card-anchor";
import { OrderingStrategy } from "./ordering-strategy";

const ORDER = [ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING]

export class FoundationOrderingStrategy implements OrderingStrategy {
  accepts(anchor: CardAnchor, card: Card): boolean {
    const lastCard = anchor.lastCard
    const lastCardValue = lastCard?.value || ''
    const lastCardIndex = ORDER.indexOf(lastCardValue)
    const nextCardValue = ORDER[lastCardIndex + 1] || ''

    if (lastCard) {
      return nextCardValue !== undefined && card.suit === lastCard.suit && nextCardValue === card.value
    } else {
      return card.value === ACE
    }
  }
}