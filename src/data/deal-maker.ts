import { CardAnchor } from "../objects/card-anchor";
import { GameData } from "./game-data";
import { CardObject } from "../objects/card-object";

const game = GameData.getInstance()

export class DealMaker {
  private deck: CardAnchor
  private target: CardAnchor

  constructor(deck: CardAnchor, target: CardAnchor) {
    this.deck = deck
    this.target = target

    this.deck.on('pointerup', this.onDeckClick)
  }

  private onDeckClick = () => {
    const cards = this.deck.detach(game.dealCount)

    if (cards.length > 0) {
      cards.reverse().forEach((card) => {
        const actor = card as unknown as CardObject
        actor && actor.flip && actor.flip()
        this.target.attach(card)
      })
    } else {
      const tree = this.target.tree().reverse()
      this.target.next = null

      tree.forEach(stackable => {
        const cardObject = stackable as unknown as CardObject
        cardObject.flip()
        this.deck.attach(stackable)
      })
    }
  }
}