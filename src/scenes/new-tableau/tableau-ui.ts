import { Actor, ActorArgs, Engine, vec } from "excalibur";
import { EmptyStack } from "../../objects/empty-stack";
import { CardAnchor } from "./card-anchor";
import { times } from "../../utils/times";
import { BlankOrderingStrategy } from "./blank-ordering-strategy";
import { FoundationOrderingStrategy } from "./foundation-ordering-strategy";
import { TableauOrderingStrategy } from "./tableau-ordering-strategy";
import { HangingStackStrategy } from "./hanging-stack-strategy";
import { ZeroPositionStrategy } from "./zero-position-strategy";

const HALF_CARD_WIDTH = 64 + 16
const HALF_CARD_HEIGHT = 96 + 16
const WASTE_PILE = 10000

export class TableauUi extends Actor {
  private emptyDeck = new EmptyStack({ name: 'EmptyDeck' })
  private _deckPile = new CardAnchor({ name: 'DeckPile' })
  private _wastePiles: CardAnchor[] = []
  private _foundationPiles: CardAnchor[] = []
  private _tableauPiles: CardAnchor[] = []

  get deck() { return this._deckPile }
  get wastePiles() { return [...this._wastePiles] }
  get foundationPiles() { return [...this._foundationPiles] }
  get tableauPiles() { return [...this._tableauPiles] }

  constructor(args?: ActorArgs) {
    super(args)

    this.emptyDeck.z = -WASTE_PILE
    this._deckPile.positioningStrategy = new ZeroPositionStrategy()
    this._deckPile.special = true
    times(3).forEach((_, index) => {
      const anchor = new CardAnchor({ name: `Waste${index}` })
      anchor.orderingStrategy = new BlankOrderingStrategy()
      anchor.positioningStrategy = new ZeroPositionStrategy()
      anchor.z = WASTE_PILE - (index * 1000)
      this._wastePiles.push(anchor)
    })
    times(4).forEach((_, index) => {
      const anchor = new CardAnchor({ name: `Foundation${index}` })
      anchor.shadow = true
      anchor.orderingStrategy = new FoundationOrderingStrategy()
      anchor.positioningStrategy = new ZeroPositionStrategy()
      this._foundationPiles.push(anchor)
    })
    times(7).forEach((_, index) => {
      const anchor = new CardAnchor({ name: `Tableau${index}` })
      anchor.shadow = true
      anchor.orderingStrategy = new TableauOrderingStrategy()
      anchor.positioningStrategy = new HangingStackStrategy()
      this._tableauPiles.push(anchor)
    })
  }

  override onAdd(engine: Engine): void {
    super.onAdd(engine)

    this.uiActors.forEach(a => this.addChild(a))
  }

  override onRemove(engine: Engine): void {
    super.onRemove(engine)

    this.uiActors.forEach(a => this.removeChild(a))
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const origin = engine.screen.screenToWorldCoordinates(vec(0, 0))
    const maxWidth = ((HALF_CARD_WIDTH * 2) + 16) * this._tableauPiles.length
    const width = Math.min(engine.screen.width, maxWidth)
    const range = width - (HALF_CARD_WIDTH * 2)
    const unit = range / (this._tableauPiles.length - 1)
    const screenCenter = engine.screen.screenToWorldCoordinates(engine.screen.center)
    const modifiedCenter = screenCenter.clone()
    modifiedCenter.x -= (width / 2)

    this._deckPile.pos = vec(modifiedCenter.x + HALF_CARD_WIDTH, origin.y + HALF_CARD_HEIGHT)
    this.emptyDeck.pos = this._deckPile.pos
    this._foundationPiles.forEach((p, i) => {
      const x = modifiedCenter.x + width - (HALF_CARD_WIDTH) - (i * (HALF_CARD_HEIGHT + 16))
      p.pos = vec(x, this._deckPile.pos.y)
    })
    this._tableauPiles.forEach((p, i) => {
      p.pos = vec(modifiedCenter.x + HALF_CARD_WIDTH + (unit * i), this._deckPile.pos.y + 220)
    })
    this._wastePiles.forEach((p, i) => {
      const pos = this._deckPile.pos.clone()
      pos.x += (160 + (i * 20))
      p.pos = pos
    })
  }

  private get uiActors(): Actor[] {
    return [
      this.emptyDeck,
      this._deckPile,
      ...this._wastePiles,
      ...this._foundationPiles,
      ...this._tableauPiles
    ]
  }
}