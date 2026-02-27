import { ActionSequence, easeInCubic, Engine, Keys, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { CardGraphic } from "../graphics/card-graphic";
import { StackShadow } from "../objects/stack-shadow";
import { Card, HEART, TEN } from "../card-shoe/cards/card";
import { CardSide } from "../data/card-side";
import { HARVESTING, InputMachine, PLAYING } from "./animation-test/input-machine";
import { InputStateMachineInstance } from "./animation-test/input-state-machine";
import { Factories } from "../objects/factories";

const factory = Factories.getInstance()

export class StateBasedAnimationTest extends Scene {
  private instructions = factory.labelFactory.create('Left click to create waypoints.\nClick and hold to clear waypoints.\nPress [SPACE] to play', TextAlign.Left)
  private card?: CardGraphic
  private travelingShadow?: StackShadow
  private spots: StackShadow[] = []
  private length = 0
  private inputMachine?: InputMachine<StateBasedAnimationTest>

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.inputMachine = new InputMachine<StateBasedAnimationTest>(this, engine)
    this.inputMachine?.addMachine(
      HARVESTING,
      InputStateMachineInstance.create<StateBasedAnimationTest>(
        (engine: Engine, host: StateBasedAnimationTest) => {
          this.length = Date.now()
        },
        (engine: Engine, host: StateBasedAnimationTest) => {
          if (this.length && Date.now() - this.length > 2000) {
            this.clearPoints()
          } else {
            this.length = 0
            this.addPoint()
          }
        },
        (engine: Engine, host: StateBasedAnimationTest) => {
          if (this.inputMachine) {
            this.inputMachine.state = PLAYING
            this.play()
          }
        },
      )
    )
    this.inputMachine?.addMachine(
      PLAYING,
      InputStateMachineInstance.create<StateBasedAnimationTest>(
        (engine: Engine, host: StateBasedAnimationTest) => {},
        (engine: Engine, host: StateBasedAnimationTest) => {},
        (engine: Engine, host: StateBasedAnimationTest) => {},
      )
    )
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    const center = context.engine.screenToWorldCoordinates(context.engine.screen.center)
    this.card = new CardGraphic({ card: new Card(HEART, TEN), face: CardSide.FRONT })
    this.travelingShadow = new StackShadow()
    this.travelingShadow.z = 9000
    this.card.pos = center

    if (this.travelingShadow && this.inputMachine) {
      this.travelingShadow.on('pointerdown', this.inputMachine.handlePointerDown)
      this.travelingShadow.on('pointerup', this.inputMachine.handlePointerUp)
    }

    const actors = [this.card, this.travelingShadow]
    actors.forEach((actor) => {
      this.add(actor)
    })
    this.add(this.instructions)
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    const actors = [this.card, this.travelingShadow, this.instructions]
    actors.forEach((actor) => {
      if (actor && this.inputMachine) {
        actor.off('pointerdown', this.inputMachine.handlePointerDown)
        actor.off('pointerup', this.inputMachine.handlePointerUp)
        this.remove(actor)
      }
    })
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const vector = engine.input.pointers.at(0).lastWorldPos
    const mouse = vec(vector.x, vector.y)
    const duration = Date.now() - this.length
    const origin = engine.screenToWorldCoordinates(vec(0, 0))

    if (this.travelingShadow) {
      this.travelingShadow.pos = mouse
    }

    this.spots.forEach(spot => {
      if (this.length && duration > 2000) {
        spot.selected = true
      }
    })

    if (engine.input.keyboard.wasPressed(Keys.Space) && this.inputMachine) {
      this.inputMachine.handleSpacePress()
    }

    this.instructions.pos = vec(origin.x + 10, origin.y + 10)
  }

  private clearPoints = () => {
    this.spots.forEach(spot => {
      if (spot) this.remove(spot)
    })
    this.spots = []
  }

  private addPoint = () => {
    const newCard = new StackShadow()
    const position = this.travelingShadow?.pos.clone()
    if (position) {
      newCard.pos = position
      this.add(newCard)
      this.spots.push(newCard)
    }
  }

  private play() {
    const card = this.card

    if (!card) return

    const sequence = new ActionSequence(card, (ctx) => {
      this.spots.forEach((spot) => {
        ctx.moveTo({ pos: spot.pos.clone(), duration: 200, easing: easeInCubic })
        ctx.delay(100)
      })
    })

    card.actions.runAction(sequence).toPromise().then(() => {
      if (this.inputMachine) {
        this.clearPoints()
        this.inputMachine.state = HARVESTING
      }
    })
  }
}