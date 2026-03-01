import { Vector } from "excalibur";
import { FlippableActor } from "./flippable-actor";
import { PositioningStrategy } from "./positioning-strategy";

const xOffset = 2
const yOffset = 3

export class VerticalStackStrategy implements PositioningStrategy {
  positionFor(lastCard: FlippableActor, _card: FlippableActor, index: number): Vector {
    const position = lastCard.pos.clone()
    const offset = Math.floor(index / 5)

    position.x += (offset * xOffset)
    position.y += (offset * yOffset)

    return position
  }
}