import { Engine } from "excalibur";

type InputStateMachineHandler<T> = (engine: Engine, host: T) => void

export interface InputStateMachine<T> {
  handlePointerDown: InputStateMachineHandler<T>;
  handlePointerUp: InputStateMachineHandler<T>;
  handleSpacePress: InputStateMachineHandler<T>;
}

export class InputStateMachineInstance {
  static create<T>(
    handlePointerDown: InputStateMachineHandler<T>,
    handlePointerUp: InputStateMachineHandler<T>,
    handleSpacePress: InputStateMachineHandler<T>
  ): InputStateMachine<T> {
    return {
      handlePointerDown,
      handlePointerUp,
      handleSpacePress
    }
  }
}