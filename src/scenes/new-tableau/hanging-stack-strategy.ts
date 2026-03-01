import { Vector } from "excalibur";
import { PositioningStrategy } from "./positioning-strategy";
import { FlippableActor } from "./flippable-actor";

const backOffset = 10
const frontOffset = 30

export class HangingStackStrategy implements PositioningStrategy {
  positionFor(lastCard: FlippableActor, _card: FlippableActor, _index: number): Vector {
    const position = lastCard.pos.clone()

    if (lastCard.back) {
      position.y += backOffset
    } else if (lastCard.front) {
      position.y += frontOffset
    }

    return position
  }
}