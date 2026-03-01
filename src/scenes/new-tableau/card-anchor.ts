import { Actor, Engine, Keys, vec } from "excalibur";
import { StackShadow } from "../../objects/stack-shadow";
import { PositioningStrategy } from "./positioning-strategy";
import { BlankPositionStrategy } from "./blank-position-strategy";
import { FlippableActor } from "./flippable-actor";

export class CardAnchor extends Actor implements FlippableActor {
  private _cards: FlippableActor[] = []
  private _shadow = false
  private _shadowActor?: StackShadow
  private _positioningStrategy: PositioningStrategy = new BlankPositionStrategy()

  flip() {}
  get front() { return false }
  get back() { return false }

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

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const lastCard = this._cards.reduce<FlippableActor>((last, card, index) => {
      const newPosition = this.positioningStrategy.positionFor(last, card, index)
      card.pos = newPosition
      return card
    }, this)

    const colliderHeight = (lastCard.pos.y - this.pos.y) + 192
    const center = vec(0, (colliderHeight / 2) - 96)
    this.collider.useBoxCollider(128, colliderHeight, undefined, center)
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
    const zFor = (count: number) => {
      return -(count * 5) - 10
    }

    [...this._cards].reverse().forEach((card, index) => {
      const z = zFor(index)
      //@ts-ignore
      console.log(`Set '${card.name}/${card?.source?._card?.toString()}' to '${z}'`)
      card.z = z
    })

    if (this._shadowActor && this.hasChild(this._shadowActor)) {
      const z = zFor(this._cards.length)
      this._shadowActor.z = z
      console.log(`Set shadow to '${z}'`)
    }
  }
}