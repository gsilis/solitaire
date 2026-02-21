import { Actor, Engine, vec } from "excalibur";
import { Stackable } from "./interfaces/stackable";
import { times } from "../utils/times";
import { CardObject } from "./card-object";

export abstract class CardAnchor extends Actor implements Stackable {
  private _next: Stackable | null = null

  previous(): Stackable {
    return this
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
    if (last) {
      last.next = stackable
    } else {
      this.next = stackable
    }
  }

  detach(count: number = 1): Stackable[] {
    const cards = this.last(count + 1).filter(Boolean)
    const lastInStack = cards[0]

    if (cards.length > count) { cards.shift() }

    if (lastInStack && lastInStack !== this.next) {
      lastInStack.next = null
    } else {
      this.next = null
    }

    return cards
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    let item: Stackable | null = this.next
    let count = 0
    while (item) {
      const castAsActor = item as unknown as Actor
      const newPosition = vec(
        this.pos.x + this.xPositionFor(count),
        this.pos.y + this.yPositionFor(count)
      )
      castAsActor.pos = newPosition
      castAsActor.z = count

      count += 1
      item = item.next
    }
  }

  abstract yPositionFor(index: number): number
  abstract xPositionFor(index: number): number
}