import { Vector } from "excalibur";
import { PositioningStrategy } from "./positioning-strategy";
import { FlippableActor } from "./flippable-actor";

export class BlankPositionStrategy implements PositioningStrategy {
  positionFor(_lastCard: FlippableActor, _card: FlippableActor): Vector {
    return new Vector(0, 0)
  }
}