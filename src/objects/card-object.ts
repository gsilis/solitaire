import { Actor, ActorArgs, Engine } from "excalibur";
import { Card } from "../card-shoe/cards/card";
import { CardGraphic } from "../graphics/card-graphic";
import { CardSide } from "../data/card-side";
import { Stackable } from "./interfaces/stackable";

type CardArgs = ActorArgs & { card: Card, face: CardSide, next: Stackable | null }

export class CardObject extends Actor implements Stackable {
  private _card: Card
  private _graphics: CardGraphic
  private _next: Stackable | null = null

  constructor(args: CardArgs) {
    super(args)
    const card = args.card
    const face = args.face || CardSide.BACK

    this._next = args.next
    this._card = card
    this._graphics = new CardGraphic({ card, face })
    this.collider.useBoxCollider(110, 176)
  }

  get isHidden() {
    return this._graphics.side === CardSide.BACK
  }

  override onAdd(engine: Engine): void {
    super.onAdd(engine)
    this.addChild(this._graphics)
  }

  override onRemove(engine: Engine): void {
    super.onRemove(engine)
    this.removeChild(this._graphics)
  }

  flip() {
    this._graphics.flip()
  }

  get next(): Stackable | null {
    return this._next
  }

  set next(stackable: Stackable | null) {
    this._next = stackable
  }

  tree(): Stackable[] {
    const items = this.next && this.next.tree() || []

    return [
      this,
      ...items
    ]
  }

  toString() {
    return this._card.toString()
  }
}