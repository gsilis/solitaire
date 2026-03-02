import { Actor, Engine, vec } from "excalibur";
import { StackShadow } from "../../objects/stack-shadow";
import { PositioningStrategy } from "./positioning-strategy";
import { BlankPositionStrategy } from "./blank-position-strategy";
import { FlippableActor } from "./flippable-actor";
import { OrderingStrategy } from "./ordering-strategy";
import { BlankOrderingStrategy } from "./blank-ordering-strategy";
import { Card } from "../../card-shoe/cards/card";

export class CardAnchor extends Actor implements FlippableActor, OrderingStrategy {
  private _cards: FlippableActor[] = []
  private _shadow = false
  private _shadowActor?: StackShadow
  private _positioningStrategy: PositioningStrategy = new BlankPositionStrategy()
  private _orderingStrategy: OrderingStrategy = new BlankOrderingStrategy()
  private _special = false
  private _cachedColliderHeight = 0

  flip() {}
  get isRoot() { return true }
  get front() { return false }
  get back() { return false }
  get card() { return undefined }
  get special() { return this._special }
  set special(value: boolean) { this._special = value; this.orderCards() }
  get lastCard() { return this.lastCardGraphic?.card || null }
  get lastCardGraphic() { return this._cards[this._cards.length - 1] }

  get shadow() { return this._shadow }
  set shadow(value: boolean) {
    const isAdding = !this._shadow && value
    const isRemoving = this._shadow && !value

    this._shadow = value

    if (isAdding) {
      this.showShadow()
    } else if (isRemoving) {
      this.hideShadow()
    }
  }

  get positioningStrategy() { return this._positioningStrategy }
  set positioningStrategy(value: PositioningStrategy) {
    this._positioningStrategy = value
  }
  get orderingStrategy() { return this._orderingStrategy }
  set orderingStrategy(value: OrderingStrategy) {
    this._orderingStrategy = value
  }

  attach(...cards: FlippableActor[]) {
    this._cards.push(...cards)
    this.orderCards()
  }

  detach(start: FlippableActor): FlippableActor[] {
    const index = this._cards.indexOf(start)
    if (index < 0) return []

    const cards = this._cards.splice(index, this._cards.length)
    this.orderCards()
    return cards
  }

  detachAll(): FlippableActor[] {
    const card = this._cards[0]
    if (!card) return []

    return this.detach(card)
  }

  getCardAt(index: number): FlippableActor | undefined {
    return this._cards[index]
  }

  accepts(_anchor: CardAnchor, card: Card): boolean {
    return this._orderingStrategy.accepts(this, card)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const lastCard = this._cards.reduce<FlippableActor>((last, card, index) => {
      const newPosition = this.positioningStrategy.positionFor(last, card, index)
      card.pos = newPosition
      return card
    }, this)

    const colliderHeight = this.special ? 192 : (lastCard.pos.y - this.pos.y) + 192
    const center = vec(0, (colliderHeight / 2) - 96)

    if (this._cachedColliderHeight !== colliderHeight) {
      this.collider.useBoxCollider(128, colliderHeight, undefined, center)
      this._cachedColliderHeight = colliderHeight
    }
  }

  private showShadow = () => {
    if (!this._shadowActor) {
      this._shadowActor = new StackShadow()
    }

    this.addChild(this._shadowActor)
  }

  private hideShadow = () => {
    if (this._shadowActor) {
      this.removeChild(this._shadowActor)
    }
  }

  private orderCards = () => {
    [...this._cards].forEach((card, index) => {
      card.z = (this.special ? this.globalZ : -this.globalZ) + (index * 5)
    })

    if (this._shadowActor && this.hasChild(this._shadowActor)) {
      this._shadowActor.z = -(this.z) - 3000
    }
  }
}