import { Actor, easeInOutCubic, Engine, vec } from "excalibur";
import { Stackable } from "./interfaces/stackable";
import { times } from "../utils/times";
import { CardObject } from "./card-object";

export abstract class CardAnchor extends Actor implements Stackable {
  private _next: Stackable | null = null
  private _forceCardUpdate: boolean = false

  previous(): Stackable {
    return this
  }

  get forceCards() {
    return this._forceCardUpdate
  }

  set forceCards(mode: boolean) {
    this._forceCardUpdate = mode
  }

  get next(): Stackable | null {
    return this._next
  }

  set next(stackable: Stackable | null) {
    this._next = stackable
  }

  get lastCard(): Stackable | null {
    return this.last(1)[0]
  }

  get firstCard(): Stackable | null {
    const tree = this.tree()
    const card = tree.shift()

    return card === undefined ? null : card
  }

  flipLast() {
    const card = this.lastCard as CardObject
    if (card) card.flip()
  }

  last(count: number = 1): Stackable[] {
    const arr = [...this.tree()]
    const temp: Stackable[] = []

    times(count).forEach(() => temp.unshift(arr.pop() as Stackable))
    return temp
  }

  tree(): Stackable[] {
    return [
      ...(this.next && this.next.tree() || [])
    ]
  }

  attach(stackable: Stackable) {    
    stackable.next = null

    const last = this.lastCard
    const length = this.tree().length
    if (last) {
      last.next = stackable
    } else {
      this.next = stackable
    }

    const stackableActor = stackable as unknown as CardObject
    const pos = vec(
      this.pos.x + this.xPositionFor(length),
      this.pos.y + this.yPositionFor(length)
    )
    if (this._forceCardUpdate) {
      stackableActor.pos = pos
    } else {
      stackableActor.actions.clearActions()
      stackableActor.actions.moveTo({
        pos,
        duration: 300,
        easing: easeInOutCubic
      })
    }
    this.redoBounds(length + 1)
  }

  detach(count: number = 1): Stackable[] {
    const cards = this.last(count + 1).filter(Boolean)
    const lastInStack = cards[0]

    if (cards.length > count) { cards.shift() }
    const firstCard = cards[0]

    if (lastInStack && lastInStack !== firstCard) {
      lastInStack.next = null
    } else {
      this.next = null
    }

    const report = cards.map(card => {
      const castCard = card as unknown as CardObject
      const nextCard = card.next as unknown as CardObject
      return [castCard?.toString(), nextCard?.toString()].toString()
    })
    console.log(report)

    return cards
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    let item: Stackable | null = this.next
    let count = 0
    while (item) {
      const castAsActor = item as unknown as Actor
      castAsActor.z = this.z - 90 + count

      if (this._forceCardUpdate) {
        castAsActor.pos.x = this.pos.x + this.xPositionFor(count)
        castAsActor.pos.y = this.pos.y + this.yPositionFor(count)
      }

      count += 1
      item = item.next
    }
  }

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)
  }

  abstract yPositionFor(index: number): number
  abstract xPositionFor(index: number): number

  private redoBounds(cardCount: number) {
    const lastCardHeight = this.yPositionFor(cardCount - 1)
    const colliderHeight = lastCardHeight + 192
    const center = vec(0, (colliderHeight / 2) - 96)

    this.collider.useBoxCollider(128, colliderHeight, undefined, center)
  }
}