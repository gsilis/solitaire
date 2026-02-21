import { CardAnchor } from "../objects/card-anchor";

export class Dealer {
  private deck: CardAnchor
  private slots: CardAnchor[]

  constructor(deck: CardAnchor, slots: CardAnchor[]) {
    this.deck = deck
    this.slots = slots
  }

  deal() {
    const targets = [...this.slots]

    while (targets.length > 0) {
      targets.forEach((target) => {
        const card = this.deck.detach(1)[0]
        const lastCard = target.lastCard
        if (lastCard) {
          lastCard.next = card
        } else {
          target.next = card
        }
      })

      targets.shift()
    }

    this.slots.forEach(slot => {
      slot.flipLast()
    })
  }
}