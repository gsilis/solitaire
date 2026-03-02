import { Actor, Engine, Scene, SceneActivationContext } from "excalibur";
import { StackManager } from "./new-tableau/stack-manager";
import { CardAnchor } from "./new-tableau/card-anchor";
import { TableauUi } from "./new-tableau/tableau-ui";

const Indices = {
  TABLEAU: 2000,
  TEMPORARY: 30000,
}

export class NewTableauScene extends Scene {
  private temporary = new CardAnchor()
  private stackManager = new StackManager(this.temporary)
  private tableauUi = new TableauUi()

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.actorAssets.forEach(a => this.add(a))
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.temporary.pos = engine.input.pointers.at(0).lastScreenPos
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.actorAssets.forEach(a => this.remove(a))
    this.stackManager.cleanup()
  }

  private get actorAssets(): Actor[] {
    return [
      this.tableauUi,
      this.temporary,
    ]
  }
}