import { Actor, Color, Engine, Scene, SceneActivationContext } from "excalibur";
import { StackManager } from "./new-tableau/stack-manager";
import { CardAnchor } from "./new-tableau/card-anchor";
import { TableauUi } from "./new-tableau/tableau-ui";
import { GameDeck } from "./new-tableau/game-deck";
import { GameDealer } from "./new-tableau/game-dealer";
import { HangingStackStrategy } from "./new-tableau/hanging-stack-strategy";
import { CardDealer } from "./new-tableau/card-dealer";
import { GameData, State } from "../data/game-data";
import { GameMenu } from "./new-tableau/game-menu";
import { Card } from "../card-shoe/cards/card";

const game = GameData.getInstance()

export class NewTableauScene extends Scene {
  backgroundColor = Color.fromHex('#146e2d')

  private temporary = new CardAnchor()
  private stackManager?: StackManager
  private tableauUi = new TableauUi()
  private gameDeck = new GameDeck(this, this.tableauUi.deck)
  private gameDealer = new GameDealer(this.tableauUi.deck, this.tableauUi.tableauPiles)
  private cardDealer = new CardDealer(this.tableauUi.deck, this.tableauUi.wastePiles)
  private gameMenu = new GameMenu()
  private cachedCards: Card[] = []

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.stackManager = new StackManager(this.temporary, this.onStackChange)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    game.state = State.PLAYING
    this.temporary.positioningStrategy = new HangingStackStrategy()
    this.temporary.z = 20000
    this.temporary.special = true
    this.actorAssets.forEach(a => this.add(a))
    game.shuffle()
    this.cachedCards = game.shoe.currentOrder()
    this.setTable()
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.temporary.pos = engine.input.pointers.at(0).lastWorldPos
    this.gameMenu.setup(engine, this.onQuit, this.onRedeal, this.onReset)
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.gameMenu.teardown()
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

  private setTable = () => {
    this.gameDeck.teardown()

    const phantomCards = this.gameDeck.setup(game)
    const stacks = [
      ...this.tableauUi.tableauPiles,
      ...this.tableauUi.foundationPiles,
      ...this.tableauUi.wastePiles
    ]

    this.gameMenu.enabled = false
    this.gameDealer.deal().then(() => {
      this.tableauUi.tableauPiles.forEach(p => {
        p?.lastCardGraphic?.flip()
      })
    })

    game.plays += 1
    game.attempts = 1

    if (!this.stackManager) return
    this.stackManager.addCards(...phantomCards)
    this.stackManager.addStacks(...stacks)

    this.gameMenu.enabled = true
  }

  private onStackChange = (stack: CardAnchor) => {
    this.cardDealer.update()
  }

  private clearTable = () => {
    const anchors = [
      ...this.tableauUi.tableauPiles,
      ...this.tableauUi.foundationPiles,
      ...this.tableauUi.wastePiles,
      this.tableauUi.deck
    ]

    anchors.forEach(a => a.detachAll())
  }

  private onQuit = () => {
    this.gameMenu.enabled = false
    this.clearTable()
  }

  private onRedeal = () => {
    this.gameMenu.enabled = false
    this.clearTable()
    game.shuffle()
    this.cachedCards = game.shoe.currentOrder()
    this.setTable()
  }

  private onReset = () => {
    this.gameMenu.enabled = false
    this.clearTable()
    game.reset([ ... this.cachedCards ])
    this.setTable()
  }
}