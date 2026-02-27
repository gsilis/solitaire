import { Engine } from "excalibur";
import { InputStateMachine } from "./input-state-machine";

export class NullState<T> implements InputStateMachine<T> {
  handlePointerDown(_engine: Engine, _host: T): void {}
  handlePointerUp(_engine: Engine, _host: T): void {}
  handleSpacePress(_engine: Engine, _host: T): void {}
}