import { SuitGraphic } from "./suit-graphic";

export class HeartGraphic extends SuitGraphic {
  get spriteCoordinates() {
    return [0, 1] as [number, number]
  }
}