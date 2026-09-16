import { times } from "../../utils/times"
import { CardAnchor } from "./card-anchor"

export class GameDealer {
  private deck: CardAnchor
  private slots: CardAnchor[]

  constructor(deck: CardAnchor, slots: CardAnchor[]) {
    this.deck = deck
    this.slots = slots
  }

  deal() {
    return new Promise<undefined>(async (resolve) => {
      const targets = [...this.slots]
      const targetSequence: CardAnchor[] = []

      while (targets.length > 0) {
        targets.forEach(t => targetSequence.push(t))
        targets.shift()
      }

      // Allow some time for the cards to be attached to the deck
      await new Promise(r => setTimeout(r, 10))

      times(28).forEach((_, index) => {
        const card = this.deck.detach(this.deck.lastCardGraphic)
        const target = targetSequence.shift()

        if (target) {
          card.forEach(c => c.delay(index * 150))
          target.attach(...card)
        }
      })

      this.slots.forEach((slot) => {
        slot.lastCardGraphic?.flip()
      })

      while (targets.length > 0) {
        targets.forEach((target) => {
          const card = this.deck.detach(this.deck.lastCardGraphic)
          target.attach(...card)
        })

        targets.shift()
      }

      this.slots.forEach(slot => {
        slot.lastCardGraphic?.flip()
      })

      resolve(undefined)
    })
  }
}
