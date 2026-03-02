import { Actor } from "excalibur";
import { Card } from "../../card-shoe/cards/card";

export interface FlippableActor extends Actor {
  flip(): void

  get isRoot(): boolean
  get front(): boolean
  get back(): boolean
  get card(): Card | undefined
}