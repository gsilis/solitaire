import { CardAnchor } from "../objects/card-anchor";
import { GameData } from "./game-data";
import { CardObject } from "../objects/card-object";

const game = GameData.getInstance()

export class DealMaker {
  private deck: CardAnchor
  private target: CardAnchor
  private target1: CardAnchor
  private target2: CardAnchor

  constructor(deck: CardAnchor, target: CardAnchor, target1: CardAnchor, target2: CardAnchor) {
    this.deck = deck
    this.target = target
    this.target1 = target1
    this.target2 = target2

    this.deck.on('pointerup', this.onDeckClick)
  }

  private onDeckClick = () => {
    const cards = this.deck.detach(game.dealCount)

    if (cards.length > 0) {
      [
        ...this.target1.detach(1),
        ...this.target2.detach(1),
      ].forEach((card) => {
        this.target.attach(card)
      })

      const [card1, card2, card3] = cards.reverse().map((card) => {
        const cast = card as CardObject
        cast.flip()
        return card
      })
      
      if (card3) {
        this.target2.attach(card3)
        this.target2.mouseEvents = true
      } else {
        this.target2.mouseEvents = false
      }
      if (card2) {
        this.target1.attach(card2)
        this.target1.mouseEvents = !card3
      } else {
        this.target1.mouseEvents = false
      }
      if (card1) {
        this.target.attach(card1)
        this.target.mouseEvents = !card2
      } else {
        this.target.mouseEvents = false
      }
    } else {
      // No cards left in the deck.
      const mainTree = this.target.tree()
      const tree = [
        ...this.target.detach(mainTree.length),
        ...this.target1.detach(1),
        ...this.target2.detach(1),
      ].reverse()
      this.target.next = null

      tree.forEach(stackable => {
        const cardObject = stackable as unknown as CardObject
        cardObject.flip()
        this.deck.attach(stackable)
      })
    }
  }
}