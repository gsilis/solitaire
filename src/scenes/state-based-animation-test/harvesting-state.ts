import { Engine } from "excalibur";
import { InputStateMachine } from "./input-state-machine";

export class HarvestingState<T> implements InputStateMachine<T> {
  handlePointerDown(engine: Engine, host: T): void {}
  handlePointerUp(engine: Engine, host: T): void {}
  handleSpacePress(engine: Engine, host: T): void {}
}