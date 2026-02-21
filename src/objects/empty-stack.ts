import { Actor, Engine } from "excalibur";
import { Resources } from "../resources";

export class EmptyStack extends Actor {
  onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.graphics.use(Resources.EmptyStack.toSprite())
  }
}