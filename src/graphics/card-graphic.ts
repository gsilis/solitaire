import { Actor, ActorArgs, Color, Engine, Label, vec, Vector } from "excalibur";
import { CardSide } from "../data/card-side";
import { Resources } from "../resources";
import { times } from "../utils/times";
import { ACE, Card, EIGHT, FIVE, FOUR, NINE, SEVEN, SIX, TEN, THREE, TWO, Value } from "../card-shoe/cards/card";
import { Factories } from "../objects/factories";

const factories = Factories.getInstance()
const positions: Partial<Record<Value, Vector[]>> = {
  [ACE]: [
    vec(0, 0)
  ],
  [TWO]: [
    vec(0, -16),
    vec(0, 16)
  ],
  [THREE]: [
    vec(-24, -36),
    vec(0, 0),
    vec(24, 36)
  ],
  [FOUR]: [
    vec(-24, -36),
    vec(24, -36),
    vec(-24, 36),
    vec(24, 36),
  ],
  [FIVE]: [
    vec(-24, -36),
    vec(24, -36),
    vec(-24, 36),
    vec(24, 36),
    vec(0, 0),
  ],
  [SIX]: [
    vec(-24, -36),
    vec(-24, 0),
    vec(-24, 36),
    vec(24, -36),
    vec(24, 0),
    vec(24, 36),
  ],
  [SEVEN]: [
    vec(-24, -36),
    vec(-24, 0),
    vec(-24, 36),
    vec(24, -36),
    vec(24, 0),
    vec(24, 36),
    vec(0, -16),
  ],
  [EIGHT]: [
    vec(-24, -36),
    vec(-24, 0),
    vec(-24, 36),
    vec(24, -36),
    vec(24, 0),
    vec(24, 36),
    vec(0, -16),
    vec(0, 16),
  ],
  [NINE]: [
    vec(-24, -36),
    vec(-24, -12),
    vec(-24, 12),
    vec(-24, 36),
    vec(24, -36),
    vec(24, -12),
    vec(24, 12),
    vec(24, 36),
    vec(0, -24),
  ],
  [TEN]: [
    vec(-24, -36),
    vec(-24, -12),
    vec(-24, 12),
    vec(-24, 36),
    vec(24, -36),
    vec(24, -12),
    vec(24, 12),
    vec(24, 36),
    vec(0, -24),
    vec(0, 24),
  ],
}

type CardGraphicOpts = ActorArgs & { card: Card, face?: CardSide }

export class CardGraphic extends Actor {
  private _side: CardSide
  private _card: Card
  private _label1: Label
  private _label2: Label
  private _icon1: Actor
  private _icon2: Actor
  private _suitMarkers: Actor[] = []
  private _followActor?: Actor

  get side() { return this._side }
  public flip() {
    if (this._side === CardSide.BACK) {
      this._side = CardSide.FRONT
    } else {
      this._side = CardSide.BACK
    }

    this.updateGraphics()
  }

  set followTarget(actor: Actor | undefined) {
    if (actor) {
      this._followActor = actor
      this.actions.clearActions()
      this.actions.follow(this._followActor)
    } else {
      this._followActor = undefined
      this.actions.clearActions()
    }
  }

  constructor({ card, face, ...restOpts }: CardGraphicOpts) {
    super({ ...restOpts })

    this._card = card
    this._side = face || CardSide.BACK
    const color = this._card.isRed ? Color.Red : Color.Black
    this._label1 = factories.labelFactory.create(this._card.symbol, undefined, color)
    this._label2 = factories.labelFactory.create(this._card.symbol, undefined, color)
    this._label2.rotation = Math.PI
    this._icon1 = factories.suitFactory.create(this._card.suit)
    this._icon2 = factories.suitFactory.create(this._card.suit)
    this._icon2.rotation = Math.PI
    this._icon1.scale.x = this._icon1.scale.y = 0.6
    this._icon2.scale.x = this._icon2.scale.y = 0.6

    if (!this._card.isFace) {
      this.populateMarkers()
    }

    this.updateGraphics()
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    if (this._side === CardSide.FRONT) {
      this._label1.pos.x = -48
      this._label1.pos.y = -78
      this._label2.pos.x = 48
      this._label2.pos.y = 76
      this._icon1.pos.x = -42
      this._icon1.pos.y = -52
      this._icon2.pos.x = 42
      this._icon2.pos.y = 50

      const vectors = positions[this._card.value] || []
      vectors.forEach((vector: Vector, index: number) => {
        const marker = this._suitMarkers[index]

        if (marker) {
          marker.pos.x = vector.x
          marker.pos.y = vector.y
        }
      })
    }
  }

  private updateGraphics() {
    const isFront = this._side === CardSide.FRONT
    const isBack = this._side === CardSide.BACK

    if (isFront) {
      this.graphics.use(Resources.CardFront.toSprite())
      if (!this.hasChild(this._label1)) this.addChild(this._label1)
      if (!this.hasChild(this._label2)) this.addChild(this._label2)
      if (!this.hasChild(this._icon1)) this.addChild(this._icon1)
      if (!this.hasChild(this._icon2)) this.addChild(this._icon2)

      this._suitMarkers.forEach((marker) => {
        if (!this.hasChild(marker)) this.addChild(marker)
      })
    } else if (isBack) {
      this.graphics.use(Resources.CardBack.toSprite())
      if (this.hasChild(this._label1)) this.removeChild(this._label1)
      if (this.hasChild(this._label2)) this.removeChild(this._label2)
      if (this.hasChild(this._icon1)) this.removeChild(this._icon1)
      if (this.hasChild(this._icon2)) this.removeChild(this._icon2)
      
      this._suitMarkers.forEach((marker) => {
        if (this.hasChild(marker)) this.removeChild(marker)
      })
    }
  }

  private populateMarkers() {
    const value = this._card.value
    const count = value === ACE ? 1 : parseInt(value)

    if (isNaN(count)) return

    times(count).forEach(() => {
      this._suitMarkers.push(factories.suitFactory.create(this._card.suit))
    })
  }
}