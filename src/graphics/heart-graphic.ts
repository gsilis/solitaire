import { SuitGraphic } from "./suit-graphic";

export class HeartGraphic extends SuitGraphic {
  get spriteCoordinates() {
    return [1, 0] as [number, number]
  }
}