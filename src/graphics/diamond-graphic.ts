import { SuitGraphic } from "./suit-graphic";

export class DiamondGraphic extends SuitGraphic {
  get spriteCoordinates() {
    return [0, 0] as [number, number]
  }
}