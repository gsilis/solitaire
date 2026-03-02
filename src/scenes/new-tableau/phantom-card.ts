import { Actor, ActorArgs, Collider, Engine } from "excalibur";
import { FlippableActor } from "./flippable-actor";

type PhantomCardArgs = { source: FlippableActor }

export class PhantomCard extends Actor implements FlippableActor {
  private source: FlippableActor

  flip() { this.source.flip() }
  get isRoot() { return false }
  get front() { return this.source.front }
  get back() { return this.source.back }
  get card() { return this.source.card }

  constructor(args: ActorArgs & PhantomCardArgs) {
    const modifiedArgs = { width: 108, height: 172, ...args }

    //@ts-ignore
    super(modifiedArgs)
    this.source = args.source
    this.source.actions.moveTo({ pos: this.pos, duration: 0 })
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const movable = this.source.pos.clone()
    const anchor = this.pos.clone()
    const distance = anchor.distance(movable)

    if (this.source.z !== this.z - 1) {
      this.source.z = this.z - 1
    }

    // this.source.z = this.z - 1
    if (distance <= 2 && distance > 0) {
      this.source.actions.moveTo({ pos: anchor, duration: 0 })
    } else if (distance > 2) {
      this.source.actions.clearActions()
      this.source.actions.moveTo({ pos: anchor, duration: 150 })
    }
  }
}