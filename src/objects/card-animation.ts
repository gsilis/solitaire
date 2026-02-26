import { ActionSequence, Actor, easeInCubic, Engine, ParallelActions, vec, Vector } from "excalibur";
import { CardGraphic } from "../graphics/card-graphic";
import { Shoe } from "../card-shoe/shoe";
import { times, timesWithIndex } from "../utils/times";

const xspan = 200
const halfSpan = xspan / 2

export class CardAnimation extends Actor {
  private cards: CardGraphic[] = []
  private shoe?: Shoe

  onAdd(engine: Engine): void {
    super.onAdd(engine)

    this.shoe = new Shoe(1)
    this.shoe.shuffle()

    times(20).forEach(() => {
      const card = this.shoe?.deal()
      if (!card) return
      this.cards.push(new CardGraphic({ card }))
    })

    const iniitalPosition = vec(-halfSpan, 0)
    this.cards.forEach((card) => {
      this.addChild(card)
      card.pos = iniitalPosition
      card.flip()
    })

    this.runAnimation()
  }

  onRemove(engine: Engine): void {
    super.onRemove(engine)

    this.cards.forEach((card) => {
      this.removeChild(card)
    })
  }

  private runAnimation = () => {
    const size = this.cards.length
    const widthx = 350
    const unit = widthx / (size - 1)
    const offset = -(widthx / 2)
    const radian = Math.PI / 180
    const radianRange = 100
    const radianOffset = -(radianRange / 2)
    const radianUnit = radianRange / (size - 1)
    const multiplier = Math.PI / widthx
    const positions: Vector[] = []
    const rotations: number[] = []

    this.cards.forEach((_, index) => {
      const x = unit * index
      const y = (widthx / 5) * Math.sin((multiplier * x))

      const cardPosition = vec(x + offset, -y)
      const cardRotation = (radianOffset + (radianUnit * index)) * radian

      positions.push(cardPosition)
      rotations.push(cardRotation)
    })

    this.cards.forEach((card, index) => {
      timesWithIndex(index).reduce((actions, i) => {
        const position = positions[i]
        const rotation = rotations[i]
        const duration = 3 * i
        const easing = easeInCubic

        return actions.runAction(new ParallelActions([
          new ActionSequence(card, ctx => { ctx.moveTo({ pos: position, duration, easing }) }),
          new ActionSequence(card, ctx => { ctx.rotateTo({ angle: rotation, duration }) })
        ]))
      }, card.actions.moveTo({ pos: positions[0], duration: 0 }).rotateTo({ angle: rotations[0], duration: 0 }))
    })
  }
}