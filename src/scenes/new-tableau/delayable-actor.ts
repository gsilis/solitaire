export interface DelayableActor extends Actor {
  delay(time: number): void
  advance(time: number): void

  get isDelayed(): boolean
}
