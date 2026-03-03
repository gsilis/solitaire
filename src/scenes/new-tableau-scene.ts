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
import { Card, KING, suits, values } from "../card-shoe/cards/card";
import { PhantomCard } from "./new-tableau/phantom-card";

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
  private phantomCards: PhantomCard[] = []

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.stackManager = new StackManager(this.temporary, this.onStackChange)
    //@ts-ignore
    window['scene'] = this
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

    if (this.stackManager) {
      this.stackManager.cleanup()
    }

    this.phantomCards = this.gameDeck.setup(game)
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

    if (this.stackManager) {
      this.stackManager.addCards(...this.phantomCards)
      this.stackManager.addStacks(...stacks)
    }

    this.gameMenu.enabled = true
  }

  private onStackChange = (stack: CardAnchor) => {
    this.cardDealer.update()

    const hasWon = this.tableauUi.foundationPiles.reduce((win, pile) => {
      return win && pile.lastCard?.value === KING
    }, true)

    if (hasWon) {
      const cards = this.tableauUi.foundationPiles.map((pile) => {
        return pile.tree()
      })
      this.clearTable()
      this.gameDeck.teardown()
      this.engine.goToScene('gameOverAnimating', { sceneActivationData: cards })
    }
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
  
  // @ts-ignore
  private debugSolve() {
    const order = [ ...values ]
    const ace = order.pop()
    if (ace) order.unshift(ace)
    let count = 0
    this.clearTable()

    order.forEach((value) => {
      const cards = this.phantomCards.filter(c => c.card?.value === value)
      cards.forEach(card => {
        const suit = card.card?.suit
        const target = suit ? this.tableauUi.foundationPiles[suits.indexOf(suit)] : null
        card.back && card.flip()
        if (count < 51) {
          target && target.attach(card)
        } else {
          this.tableauUi.tableauPiles[this.tableauUi.tableauPiles.length - 1].attach(card)
        }
        count++
      })
    })
  }
}