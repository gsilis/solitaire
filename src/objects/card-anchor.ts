import { Actor, Engine } from "excalibur";
import { Stackable } from "./interfaces/stackable";

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

  get last(): Stackable {
    return [...this.tree()].pop() as Stackable
  }

  tree(): Stackable[] {
    const items = this.next && this.next.tree() || []

    return [
      this,
      ...items
    ]
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    let item: Stackable | null = this.next
    let count = 0
    while (item) {
      const castAsActor = item as unknown as Actor
      castAsActor.pos.x = this.pos.x + this.xPositionFor(count)
      castAsActor.pos.y = this.pos.y + this.yPositionFor(count)

      count += 1
      item = item.next
    }
  }

  abstract yPositionFor(index: number): number
  abstract xPositionFor(index: number): number
}