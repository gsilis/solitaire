import { Actor, Engine, Scene, SceneActivationContext } from "excalibur";
import { StackManager } from "./new-tableau/stack-manager";
import { CardAnchor } from "./new-tableau/card-anchor";
import { TableauUi } from "./new-tableau/tableau-ui";
import { GameDeck } from "./new-tableau/game-deck";
import { GameDealer } from "./new-tableau/game-dealer";
import { HangingStackStrategy } from "./new-tableau/hanging-stack-strategy";
import { CardDealer } from "./new-tableau/card-dealer";

export class NewTableauScene extends Scene {
  private temporary = new CardAnchor()
  private stackManager?: StackManager
  private tableauUi = new TableauUi()
  private gameDeck = new GameDeck(this, this.tableauUi.deck)
  private gameDealer = new GameDealer(this.tableauUi.deck, this.tableauUi.tableauPiles)
  private cardDealer = new CardDealer(this.tableauUi.deck, this.tableauUi.wastePiles)

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.stackManager = new StackManager(this.temporary, this.onStackChange)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.temporary.positioningStrategy = new HangingStackStrategy()
    this.temporary.z = 20000
    this.temporary.special = true
    this.actorAssets.forEach(a => this.add(a))
    this.gameDeck.teardown()

    const phantomCards = this.gameDeck.setup()
    const stacks = [
      ...this.tableauUi.tableauPiles,
      ...this.tableauUi.foundationPiles,
      ...this.tableauUi.wastePiles
    ]

    this.gameDealer.deal().then(() => {
      this.tableauUi.tableauPiles.forEach(p => {
        p.lastCardGraphic.flip()
      })
    })

    if (!this.stackManager) return

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
    if (this.stackManager) this.stackManager.cleanup()
    this.gameDeck.teardown()
  }

  private get actorAssets(): Actor[] {
    return [
      this.tableauUi,
      this.temporary,
    ]
  }

  private onStackChange = (stack: CardAnchor) => {
    this.cardDealer.update()
  }
}