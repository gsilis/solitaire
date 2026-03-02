import { Actor, ActorArgs, Collider, CollisionContact, Engine, Side } from "excalibur";
import { FlippableActor } from "./flippable-actor";

type PhantomCardArgs = { source: FlippableActor }

export class PhantomCard extends Actor implements FlippableActor {
  private source: FlippableActor

  flip() { this.source.flip() }
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

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    super.onCollisionStart(self, other, side, contact)

    this.collideReport('Collision START', self, other)
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    super.onCollisionEnd(self, other, side, lastContact)

    this.collideReport('Collision END', self, other)
  }

  private collideReport(label: string, self: Collider, other: Collider) {
    let card1: string = ''
    let card1name: string = ''
    let card1z: number = 0
    let card2: string = ''
    let card2name: string = ''
    let card2z: number = 0

    try {
      //@ts-ignore
      card1 = self.owner.source.card.toString()
      //@ts-ignore
      card1z = self.owner.globalZ
      //@ts-ignore
      card1name = self.owner.name
      //@ts-ignore
      card2 = other.owner.source.card.toString()
      //@ts-ignore
      card2z = other.owner.globalZ
      //@ts-ignore
      card2name = other.owner.name
    } catch (err) {}

    if (card1name && card2name) {
      console.log(`${label}; ${card1name} : ${card1} : ${card1z}; ${card2name} : ${card2} : ${card2z}`)
    }
  }
}