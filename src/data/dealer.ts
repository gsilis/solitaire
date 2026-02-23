import { CardAnchor } from "../objects/card-anchor";
import { times } from "../utils/times";

export class Dealer {
  private deck: CardAnchor
  private slots: CardAnchor[]

  constructor(deck: CardAnchor, slots: CardAnchor[]) {
    this.deck = deck
    this.slots = slots
  }

  deal() {
    const targets = [...this.slots]
    const targetSequence: CardAnchor[] = []

    while (targets.length > 0) {
      targets.forEach(t => targetSequence.push(t))
      targets.shift()
    }

    times(28).forEach((_, index) => {
      const delay = 100 * index
      
      setTimeout(() => {
        const card = this.deck.detach(1)[0]
        const target = targetSequence.shift()

        if (target) target.attach(card)
      }, delay)
    })

    setTimeout(() => {
      this.slots.forEach(s => s.flipLast())
    }, 2800)

    while (targets.length > 0) {
      targets.forEach((target) => {
        const card = this.deck.detach(1)[0]
        target.attach(card)
      })

      targets.shift()
    }

    this.slots.forEach(slot => {
      slot.flipLast()
    })
  }
}