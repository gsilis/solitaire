import { Engine, Scene, SceneActivationContext } from "excalibur";
import { CardAnchor } from "./new-tableau/card-anchor";
import { PhantomCard } from "./new-tableau/phantom-card";
import { HangingStackStrategy } from "./new-tableau/hanging-stack-strategy";
import { VerticalStackStrategy } from "./new-tableau/vertical-stack-strategy";
import { CardGraphic } from "../graphics/card-graphic";
import { ACE, DIAMOND, FIVE, HEART, SPADE, TEN, THREE, TWO } from "../card-shoe/cards/card";
import { StackManager } from "./new-tableau/stack-manager";
import { PermissiveOrderingStrategy } from "./new-tableau/permissive-ordering-strategy";

const Indices = {
  TABLEAU: 2000,
  TEMPORARY: 30000,
}

export class NewTableauScene extends Scene {
  private stack1 = new CardAnchor({ name: 'Stack 1' })
  private stack2 = new CardAnchor({ name: 'Stack 2' })
  private temporary = new CardAnchor({ name: 'Temporary', width: 128, height: 192 })
  private cardGraphic1 = CardGraphic.createFaceUp(HEART, ACE)
  private cardGraphic2 = CardGraphic.createFaceUp(SPADE, TWO)
  private cardGraphic3 = CardGraphic.createFaceUp(DIAMOND, TEN)
  private cardGraphic4 = CardGraphic.createFaceUp(SPADE, THREE)
  private cardGraphic5 = CardGraphic.createFaceUp(SPADE, FIVE)
  private card1 = new PhantomCard({ name: 'Card 1', source: this.cardGraphic1 })
  private card2 = new PhantomCard({ name: 'Card 2', source: this.cardGraphic2 })
  private card3 = new PhantomCard({ name: 'Card 3', source: this.cardGraphic3 })
  private card4 = new PhantomCard({ name: 'Card 4', source: this.cardGraphic4 })
  private card5 = new PhantomCard({ name: 'Card 5', source: this.cardGraphic5 })
  private stackManager = new StackManager(this.temporary)

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.add(this.stack1)
    this.add(this.stack2)
    this.add(this.temporary)
    this.add(this.card1)
    this.add(this.card2)
    this.add(this.card3)
    this.add(this.card4)
    this.add(this.card5)
    this.add(this.cardGraphic1)
    this.add(this.cardGraphic2)
    this.add(this.cardGraphic3)
    this.add(this.cardGraphic4)
    this.add(this.cardGraphic5)

    this.stack1.shadow = true
    this.stack2.shadow = true

    this.stack1.positioningStrategy = new HangingStackStrategy()
    this.stack2.positioningStrategy = new VerticalStackStrategy()
    this.stack1.orderingStrategy = new PermissiveOrderingStrategy()
    this.stack2.orderingStrategy = new PermissiveOrderingStrategy()
    this.temporary.positioningStrategy = new HangingStackStrategy()
    this.temporary.special = true
    this.temporary.collider.clear()
    this.stack1.attach(this.card1, this.card2, this.card3)
    this.stack2.attach(this.card4, this.card5)

    this.stackManager.addStacks(this.stack1, this.stack2)
    this.stackManager.addCards(this.card1, this.card2, this.card3, this.card4, this.card5)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const center = engine.screen.pageToScreenCoordinates(engine.screen.center)
    const left = center.clone()
    left.x -= 100
    const right = center.clone()
    right.x += 100

    this.stack1.pos = left
    this.stack2.pos = right

    this.temporary.pos = engine.input.pointers.at(0).lastScreenPos
    this.temporary.z = Indices.TEMPORARY

    this.stack1.z = this.stack2.z = Indices.TABLEAU
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.remove(this.stack1)
    this.remove(this.stack2)
    this.remove(this.temporary)
    this.remove(this.card1)
    this.remove(this.card2)
    this.remove(this.card3)
    this.remove(this.cardGraphic1)
    this.remove(this.cardGraphic2)
    this.remove(this.cardGraphic3)

    this.stackManager.cleanup()
  }
}