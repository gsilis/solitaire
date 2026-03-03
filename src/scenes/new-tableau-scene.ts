import { Actor, Engine, Scene, SceneActivationContext } from "excalibur";
import { StackManager } from "./new-tableau/stack-manager";
import { CardAnchor } from "./new-tableau/card-anchor";
import { TableauUi } from "./new-tableau/tableau-ui";
import { GameDeck } from "./new-tableau/game-deck";
import { GameDealer } from "./new-tableau/game-dealer";

export class NewTableauScene extends Scene {
  private temporary = new CardAnchor()
  private stackManager = new StackManager(this.temporary)
  private tableauUi = new TableauUi()
  private gameDeck = new GameDeck(this, this.tableauUi.deck)
  private gameDealer = new GameDealer(this.tableauUi.deck, this.tableauUi.tableauPiles)

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    //@ts-ignore
    window['scene'] = this

    this.actorAssets.forEach(a => this.add(a))
    this.gameDeck.teardown()

    const phantomCards = this.gameDeck.setup()
    const stacks = [...this.tableauUi.tableauPiles, ...this.tableauUi.foundationPiles]

    this.gameDealer.deal().then(() => {
      this.tableauUi.tableauPiles.forEach(p => {
        p.lastCardGraphic.flip()
      })
    })

    this.stackManager.addCards(...phantomCards)
    this.stackManager.addStacks(...stacks)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.temporary.pos = engine.input.pointers.at(0).lastWorldPos
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.actorAssets.forEach(a => this.remove(a))
    this.stackManager.cleanup()
    this.gameDeck.teardown()
  }

  private get actorAssets(): Actor[] {
    return [
      this.tableauUi,
      this.temporary,
    ]
  }
}