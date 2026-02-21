import { Actor, Engine } from "excalibur";
import { Resources } from "../resources";

export class StackShadow extends Actor {
  onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.graphics.use(Resources.CardShade.toSprite())
  }
}