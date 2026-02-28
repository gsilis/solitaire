import { Color, Engine, Keys, Scene, SceneActivationContext, vec } from "excalibur";
import { StackShadow } from "../objects/stack-shadow";
import { Factories } from "../objects/factories";
import { CardGraphic } from "../graphics/card-graphic";
import { ACE, Card, HEART } from "../card-shoe/cards/card";
import { CardSide } from "../data/card-side";
import { LinkedObject } from "./follow-anchor-point-test/linked-object";

const factories = Factories.getInstance()

export class FollowAnchorPointTest extends Scene {
  backgroundColor = Color.fromHex('#146e2d')
  
  private anchorShadow: StackShadow = new StackShadow()
  private instructions = factories.labelFactory.create('')
  private cardGraphic = new CardGraphic({ card: new Card(HEART, ACE), face: CardSide.FRONT })
  private cardFollow = new LinkedObject(this.anchorShadow, this.cardGraphic)
  private shadowFollow = true

  onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)
    this.add(this.anchorShadow)
    this.add(this.instructions)
    this.add(this.cardGraphic)

    this.cardGraphic.pos = context.engine.screen.worldToScreenCoordinates(context.engine.screen.center)
  }

  onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)
    this.remove(this.anchorShadow)
    this.remove(this.instructions)
    this.remove(this.cardGraphic)
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    if (this.shadowFollow) {
      this.anchorShadow.pos = engine.input.pointers.at(0).lastScreenPos
    }

    this.instructions.pos = vec(5, 5)
    this.instructions.text = `Move the mouse around to have the card smoothly follow it.\nF = Toggle follow\nS = Toggle Shadow Follow\n\nFoloow = ${this.cardFollow.enabled ? 'On' : 'Off'}\nShadow Follow = ${this.shadowFollow ? 'On' : 'Off'}`

    const onF = engine.input.keyboard.wasPressed(Keys.F)
    const onS = engine.input.keyboard.wasPressed(Keys.S)

    if (onF) {
      this.cardFollow.enabled = !this.cardFollow.enabled
    }

    if (onS) {
      this.shadowFollow = !this.shadowFollow
    }
  }
}