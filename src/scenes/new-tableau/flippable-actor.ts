import { Actor } from "excalibur";

export interface FlippableActor extends Actor {
  flip(): void

  get front(): boolean
  get back(): boolean
}