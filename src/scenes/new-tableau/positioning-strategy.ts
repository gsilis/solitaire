import { Vector } from "excalibur";
import { FlippableActor } from "./flippable-actor";

export interface PositioningStrategy {
  positionFor(lastCard: FlippableActor, card: FlippableActor, index: number): Vector;
}