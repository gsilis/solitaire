import { Actor } from "excalibur";
import { CardGraphic } from "../../graphics/card-graphic";

export class LinkedObject {
  private anchor: Actor
  private target: Actor
  private _enabled = true

  get enabled() { return this._enabled }
  set enabled(value: boolean) {
    this._enabled = value
    this.update()
  }

  constructor(anchor: Actor, target: Actor) {
    this.anchor = anchor
    this.target = target
    this.update()
  }

  private update() {
    if (this.enabled) {
      this.target.on('preupdate', this.onPreUpdate)
    } else {
      this.target.off('preupdate', this.onPreUpdate)
    }
  }

  private onPreUpdate = () => {
    const anchorPosition = this.anchor.pos.clone()
    const targetPosition = this.target.pos.clone()
    const distance = anchorPosition.distance(targetPosition)

    if (distance > 1) {
      this.target.actions.clearActions()
      this.target.actions.moveTo({ pos: anchorPosition, duration: 100 })
    }
  }
}