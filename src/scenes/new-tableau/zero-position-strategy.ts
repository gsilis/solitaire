import { Vector } from "excalibur";
import { PositioningStrategy } from "./positioning-strategy";
import { FlippableActor } from "./flippable-actor";

export class ZeroPositionStrategy implements PositioningStrategy {
  positionFor(lastCard: FlippableActor, _card: FlippableActor): Vector {
    return lastCard.pos.clone()
  }
}