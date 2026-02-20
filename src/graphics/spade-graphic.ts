import { SuitGraphic } from "./suit-graphic";

export class SpadeGraphic extends SuitGraphic {
  get spriteCoordinates() {
    return [1, 1] as [number, number]
  }
}