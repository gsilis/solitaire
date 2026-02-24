import { CardObject } from "./card-object";

export class FlipCardManager {
  private cards: CardObject[] = []
  private interactedCard: CardObject | null = null

  addCard(card: CardObject) {
    this.cards.push(card)

    card.on('pointerdown', () => this.onPointerDown(card))
    card.on('pointerup', () => this.onPointerUp(card))
  }

  private onPointerDown = (card: CardObject) => {
    // We only want the topmost card
    if (!this.interactedCard) {
      this.interactedCard = card
    }
  }

  private onPointerUp = (card: CardObject) => {
    const hasCard = !!this.interactedCard
    const sameCard = this.interactedCard === card
    const isLastLink = !card.next
    const isFlipped = card.isHidden

    if (hasCard && sameCard && isLastLink && isFlipped) {
      card.flip()
    }

    this.interactedCard = null
  }
}