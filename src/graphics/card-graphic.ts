import { Actor, ActorArgs, Engine, Label, vec, Vector } from "excalibur";
import { CardSide } from "../data/card-side";
import { Resources } from "../resources";
import { GameData } from "../data/game-data";
import { times } from "../utils/times";
import { ACE, Card, EIGHT, FIVE, FOUR, NINE, SEVEN, SIX, TEN, THREE, TWO, Value } from "../card-shoe/cards/card";

const game = GameData.getInstance()
const positions: Partial<Record<Value, Vector[]>> = {
  [ACE]: [
    vec(64, 192)
  ],
  [TWO]: [
    vec(64, 64),
    vec(64, 96)
  ],
  [THREE]: [
    vec(48, 48),
    vec(80, 64),
    vec(112, 80)
  ],
  [FOUR]: [
    vec(48, 48),
    vec(48, 96),
    vec(96, 48),
    vec(96, 48),
  ],
  [FIVE]: [
    vec(48, 48),
    vec(48, 96),
    vec(96, 48),
    vec(96, 48),
    vec(64, 64),
  ],
  [SIX]: [
    vec(19, 10),
    vec(20, 20),
    vec(30, 30),
    vec(40, 40),
    vec(50, 50),
    vec(60, 60),
  ],
  [SEVEN]: [
    vec(32, 10),
    vec(32, 20),
    vec(32, 30),
    vec(32, 40),
    vec(32, 50),
    vec(32, 60),
    vec(32, 70),
  ],
  [EIGHT]: [
    vec(48, 10),
    vec(48, 20),
    vec(48, 30),
    vec(48, 40),
    vec(48, 50),
    vec(48, 60),
    vec(48, 70),
    vec(48, 80),
  ],
  [NINE]: [
    vec(60, 10),
    vec(60, 20),
    vec(60, 30),
    vec(60, 40),
    vec(60, 50),
    vec(60, 60),
    vec(60, 70),
    vec(60, 80),
    vec(60, 90),
  ],
  [TEN]: [
    vec(72, 10),
    vec(72, 20),
    vec(72, 30),
    vec(72, 40),
    vec(72, 50),
    vec(72, 60),
    vec(72, 70),
    vec(72, 80),
    vec(72, 90),
    vec(72, 100),
  ],
}

type CardGraphicOpts = ActorArgs & { card: Card }

export class CardGraphic extends Actor {
  private _side: CardSide = CardSide.BACK
  private _card: Card
  private _label1: Label
  private _label2: Label
  private _suitMarkers: Actor[] = []

  get side() { return this._side }
  public flip() {
    if (this._side === CardSide.BACK) {
      this._side = CardSide.FRONT
    } else {
      this._side = CardSide.BACK
    }

    this.updateGraphics()
  }

  constructor({ card, ...restOpts }: CardGraphicOpts) {
    super({ ...restOpts })
    this._card = card
    this._label1 = game.labelFactory.create(this._card.value)
    this._label2 = game.labelFactory.create(this._card.value)

    if (!this._card.isFace) {
      this.populateMarkers()
    }

    this.updateGraphics()
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    if (this._side === CardSide.FRONT) {
      this._label1.pos.x = 32
      this._label1.pos.y = 32
      this._label2.pos.x = 96
      this._label2.pos.y = 96

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

      this._suitMarkers.forEach((marker) => {
        if (!this.hasChild(marker)) this.addChild(marker)
      })
    } else if (isBack) {
      this.graphics.use(Resources.CardBack.toSprite())
      if (this.hasChild(this._label1)) this.removeChild(this._label1)
      if (this.hasChild(this._label2)) this.removeChild(this._label2)
      
      this._suitMarkers.forEach((marker) => {
        if (this.hasChild(marker)) this.removeChild(marker)
      })
    }
  }

  private populateMarkers() {
    const count = parseInt(this._card.value)

    if (isNaN(count)) return

    times(count).forEach(() => {
      this._suitMarkers.push(game.suitFactory.create(this._card.suit))
    })
  }
}