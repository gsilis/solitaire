import { Engine } from "excalibur";
import { InputStateMachine } from "./input-state-machine";
import { NullState } from "./null-state";

export const HARVESTING = 'harvesting'
export const PLAYING = 'playing'
export type InputState = typeof HARVESTING | typeof PLAYING

export class InputMachine<T> {
  private _state: InputState = HARVESTING
  private _machine: Partial<Record<InputState, InputStateMachine<T>>> = {}
  private _engine: Engine
  private _host: T

  constructor(host: T, engine: Engine) {
    this._host = host
    this._engine = engine
  }

  get state() {
    return this._state
  }

  set state(value: InputState) {
    this._state = value
  }

  get machine(): InputStateMachine<T> {
    return this._machine[this.state] || new NullState<T>()
  }

  addMachine(state: InputState, handler: InputStateMachine<T>) {
    this._machine[state] = handler
  }

  handlePointerDown = () => {
    this.machine.handlePointerDown(this._engine, this._host)
  }

  handlePointerUp = () => {
    this.machine.handlePointerUp(this._engine, this._host)
  }

  handleSpacePress = () => {
    this.machine.handleSpacePress(this._engine, this._host)
  }
}