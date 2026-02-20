import { Actor, ActorArgs } from "excalibur";
import { CardSide } from "../data/card-side";
import { Resources } from "../resources";
import { Card } from "card-shoe/cards/card";

type CardGraphicOpts = ActorArgs & { card: Card }

export class CardGraphic extends Actor {
  private _side: CardSide = CardSide.BACK
  private _card: Card

  get side() { return this._side }
  public flip() {
    if (this._side === CardSide.BACK) {
      this._side = CardSide.FRONT
      this.graphics.use(Resources.CardFront.toSprite())
    } else {
      this._side = CardSide.BACK
      this.graphics.use(Resources.CardBack.toSprite())
    }
  }

  constructor({ card, ...restOpts }: CardGraphicOpts) {
    super({ ...restOpts })
    this._card = card
  }
}