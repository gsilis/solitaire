import { Actor, Engine, vec, Vector } from "excalibur";
import { CardGraphic } from "../graphics/card-graphic";
import { Shoe } from "../card-shoe/shoe";
import { times } from "../utils/times";

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
    const widthx = 500
    const unit = widthx / (size - 1)
    const offset = -(widthx / 2)
    const radian = Math.PI / 180
    const radianRange = 120
    const radianOffset = -(radianRange / 2)
    const radianUnit = radianRange / (size - 1)
    const multiplier = Math.PI / widthx

    this.cards.forEach((card, index) => {
      const x = unit * index
      const y = (widthx / 4.5) * Math.sin((multiplier * x))

      card.pos = vec(x + offset, -y)
      card.rotation = (radianOffset + (radianUnit * index)) * radian
    })
  }
}