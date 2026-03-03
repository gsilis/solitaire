import { GameData } from "../../data/game-data";
import { times } from "../../utils/times";
import { CardAnchor } from "./card-anchor";
import { FlippableActor } from "./flippable-actor";

const game = GameData.getInstance()

export class CardDealer {
  private _deck: CardAnchor
  private _wastePiles: CardAnchor[] = []

  constructor(deck: CardAnchor, wastePiles: CardAnchor[]) {
    this._deck = deck
    this._wastePiles = wastePiles

    this._deck.on('pointerdown', this.onDeckClick)
  }

  teardown = () => {
    this._deck.off('pointerdown', this.onDeckClick)
  }

  onDeckClick = () => {
    const cleanup = this.cleanup()

    this._wastePiles[0].attach(...cleanup)

    if (this._deck.lastCard !== null) {
      times(game.dealCount).forEach((_, index) => {
        const cards = this._deck.detach(this._deck.lastCardGraphic)
        cards.forEach(c => c.flip())
        this._wastePiles[index].attach(...cards)
      })
    } else {
      const cards = [ ...this._wastePiles[0].detachAll() ].reverse()
      cards.forEach(c => c.flip())
      this._deck.attach(...cards)
    }

    this.update()
  }

  update = () => {
    this._wastePiles.forEach(p => p.enabled = false);

    [...this._wastePiles].reverse().reduce((enabled, pile) => {
      if (!enabled && pile.lastCard !== null) {
        pile.enabled = true
        return true
      }

      return enabled
    }, false)
  }

  private cleanup = () => {
    return [1, 2].reduce<FlippableActor[]>((acc, index) => {
      const lastCard = this._wastePiles[index].lastCardGraphic
      if (lastCard) {
        acc.push(...this._wastePiles[index].detach(lastCard))
      }
      return acc
    }, [])
  }
}