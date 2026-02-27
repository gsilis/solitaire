import { Engine, Scene, SceneActivationContext, TextAlign, Vector } from "excalibur";
import { Factories } from "../objects/factories";
import { CardGraphic } from "../graphics/card-graphic";
import { ACE, Card, HEART } from "../card-shoe/cards/card";
import { CardSide } from "../data/card-side";

const factory = Factories.getInstance()
const DURATION_THRESHOLD = 2000

export class FollowAnimationTest extends Scene {
  private instructions = factory.labelFactory.create('Left click and drag wildly, the card should follow with a delay.', TextAlign.Left)
  private status = factory.labelFactory.create('', TextAlign.Left)
  private card?: CardGraphic
  private points: Vector[] = []
  private downStart = 0
  private animating = false

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.card = new CardGraphic({ card: new Card(HEART, ACE), face: CardSide.FRONT })
    this.add(this.card)
    this.add(this.instructions)
    this.add(this.status)
    this.card.pos = context.engine.screenToWorldCoordinates(context.engine.screen.center)

    this.status.pos.y = this.instructions.pos.y + 50
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.remove(this.instructions)
    if (this.card) {
      this.remove(this.card)
    }
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const isDown = engine.input.pointers.isDown(0)
    const wasDown = engine.input.pointers.wasDown(0)
    const onMouseDown = !wasDown && isDown
    const onMouseUp = wasDown && !isDown
    const position = engine.input.pointers.at(0).lastScreenPos
    const duration = isDown && (Date.now() - this.downStart) || 0
    const hasPoints = this.points.length > 0

    if (this.status) {
      this.status.text = `Queued: ${this.points.length}`
    }

    if (isDown) {
      this.points.push(position)
    }

    if (onMouseDown) {
      this.downStart = Date.now()
    }

    if (!this.animating && hasPoints) {
      this.animateNext()
    }

    if (onMouseUp) {
      this.downStart = 0

      if (duration > DURATION_THRESHOLD && this.card) {
        this.card.actions.clearActions()
        this.points = []
      }
    }
  }

  private animateNext() {
    if (!this.card) return

    this.animating = true
    const nextPoint = this.points.shift()
    
    if (!nextPoint) return

    this.card.actions.moveTo({ pos: nextPoint, duration: 50 }).toPromise().then(() => {
      this.animating = false
    })
  }
}