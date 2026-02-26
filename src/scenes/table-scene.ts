import { Color, Engine, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { StraightDownCardAnchor } from "../objects/straight-down-card-anchor";
import { GameData, State } from "../data/game-data";
import { HangingCardAnchor } from "../objects/hanging-card-anchor";
import { times } from "../utils/times";
import { CardObject } from "../objects/card-object";
import { CardSide } from "../data/card-side";
import { EmptyStack } from "../objects/empty-stack";
import { StackShadow } from "../objects/stack-shadow";
import { DealMaker } from "../data/deal-maker";
import { Dealer } from "../data/dealer";
import { StackManager } from "../objects/stack-manager";
import { CountUpStrategy } from "../objects/count-up-strategy";
import { AlternatingColorStrategy } from "../objects/alternating-color-strategy";
import { SingleCardAnchor } from "../objects/single-card-anchor";
import { StraightHorizontalCardAnchor } from "../objects/straight-horizontal-card-anchor";
import { Card, KING, suits, values } from "../card-shoe/cards/card";
import { Dom } from "../objects/dom";

const game = GameData.getInstance()
const ui = Dom.getInstance()
const width = 128
const height = 192

const INDICES = {
  CATCHALL: 0,
  EMPTY_DECK: -100,
  DECK: 10,
  PILE_SHADOW: -100,
  PILE: 200,
  PILE_1: 400,
  PILE_2: 600,

  TARGETS: [4000, 4000, 4000, 4000],
  PLAYS: [1000, 1200, 1400, 1600, 1800, 2000, 2200],
  FLOATING: 6000,
}

export class TableScene extends Scene {
  private deckAnchor = new StraightDownCardAnchor({ name: 'DeckAnchor', width, height })
  private displayAnchor = new StraightHorizontalCardAnchor({ name: 'DisplayAnchor', width, height, z: INDICES.PILE })
  private displayAnchor2 = new SingleCardAnchor({ name: 'DisplayAnchor2', width, height, z: INDICES.PILE_1 })
  private displayAnchor3 = new SingleCardAnchor({ name: 'DisplayAnchor3', width, height, z: INDICES.PILE_2 })
  private playAreas: HangingCardAnchor[] = times(7).map((_, index) => new HangingCardAnchor({ name: `PlayArea${index}`, width, height }))
  private targets: HangingCardAnchor[] = times(4).map((_, index) => new StraightDownCardAnchor({ name: `TargetArea${index}`, width, height }))
  private temporary = new HangingCardAnchor({ name: 'TemporaryStorage', width, height, z: INDICES.FLOATING })
  private cards: CardObject[] = []
  private dealer = new Dealer(this.deckAnchor, this.playAreas)
  private stackManager?: StackManager
  private countUpStrategy = new CountUpStrategy()
  private alternatingColorStrategy = new AlternatingColorStrategy()
  private originalCardOrder: Card[] = []
  private quitButton: HTMLButtonElement | null = null
  private redealButton: HTMLButtonElement | null = null
  private resetButton: HTMLButtonElement | null = null
  private dealing: boolean = false
  backgroundColor = Color.fromHex('#146e2d')

  onInitialize(engine: Engine): void {
    //@ts-ignore
    window.table = this
    super.onInitialize(engine)

    const stackManager = new StackManager(this.temporary)
    stackManager.addStack(this.deckAnchor)
    stackManager.addStack(this.displayAnchor)
    stackManager.addStack(this.displayAnchor2)
    stackManager.addStack(this.displayAnchor3)
    this.temporary.forceCards = true

    new DealMaker(this.deckAnchor, this.displayAnchor, this.displayAnchor2, this.displayAnchor3)

    this.deckAnchor.addChild(new EmptyStack({ z: INDICES.EMPTY_DECK, name: 'shadow' }))
    this.displayAnchor.addChild(new StackShadow({ z: INDICES.PILE_SHADOW, name: 'shadow' }))
    this.playAreas.forEach((play) => {
      play.cardStrategy = this.alternatingColorStrategy
      play.addChild(new StackShadow({ z: INDICES.PILE_SHADOW, name: 'shadow' }))
      stackManager.addStack(play)
    })
    this.targets.forEach((target) => {
      target.cardStrategy = this.countUpStrategy
      target.addChild(new StackShadow({ z: INDICES.PILE_SHADOW, name: 'shadow' }))
      stackManager.addStack(target)
      stackManager.addTargetStack(target)
    })

    this.stackManager = stackManager
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.positionAssets(engine)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    game.state = State.PLAYING
    this.positionAssets(context.engine)
    this.debug()

    this.add(this.deckAnchor)
    this.add(this.displayAnchor)
    this.add(this.displayAnchor2)
    this.add(this.displayAnchor3)
    this.add(this.temporary)
    this.playAreas.forEach(a => this.add(a))
    this.targets.forEach(a => this.add(a))

    this.displayAnchor.enabledIfBlank = this.displayAnchor2
    this.displayAnchor2.enabledIfBlank = this.displayAnchor3

    game.plays += 1
    game.attempts = 1
    game.shuffle()
    this.dealCards()
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.cards.forEach((card) => {
      this.contains(card) && this.remove(card)
    })
    this.cards = []
    this.remove(this.deckAnchor)
    this.remove(this.displayAnchor)
    this.remove(this.temporary)
    this.playAreas.forEach(a => this.remove(a))
    this.targets.forEach(a => this.remove(a))

    if (this.quitButton) {
      this.quitButton.removeEventListener('click', this.onQuitClick)
      this.quitButton = null
    }

    if (this.redealButton) {
      this.redealButton.removeEventListener('click', this.onRedealClick)
      this.redealButton = null
    }

    if (this.resetButton) {
      this.resetButton.removeEventListener('click', this.onRestartClick)
      this.resetButton = null
    }
  }

  private dealCards() {
    this.dealing = true
    this.originalCardOrder = game.shoe.currentOrder()
    let cardData = game.deal()

    while (cardData) {
      const card = new CardObject({
        name: `Card_${cardData.symbol}${cardData.suitGlyph}`,
        card: cardData,
        face: CardSide.BACK,
        next: null,
        width: 128,
        height: 192,
        x: this.deckAnchor.pos.x,
        y: this.deckAnchor.pos.y,
      })

      this.cards.push(card)
      this.deckAnchor.attach(card)
      this.stackManager?.addCard(card)
      this.add(card)
      cardData = game.deal()
    }

    this.dealer.deal().then(() => {
      this.dealing = false
    })
  }

  private positionAssets(engine: Engine) {
    const stageWidth = engine.screen.width
    const padding = 96
    this.deckAnchor.pos.x = 96
    this.deckAnchor.pos.y = 112
    this.displayAnchor.pos.x = this.deckAnchor.pos.x + 168
    this.displayAnchor2.pos.x = this.displayAnchor.pos.x + 28
    this.displayAnchor3.pos.x = this.displayAnchor2.pos.x + 28
    this.displayAnchor.pos.y = this.displayAnchor2.pos.y = this.displayAnchor3.pos.y = this.deckAnchor.pos.y
    this.deckAnchor.z = INDICES.DECK
    this.displayAnchor.z = INDICES.PILE
    this.displayAnchor2.z = INDICES.PILE_1
    this.displayAnchor3.z = INDICES.PILE_2

    const yTarget = this.deckAnchor.pos.y
    let xTarget = engine.screen.width - padding
    this.targets.forEach((target, index) => {
      target.pos.x = xTarget
      target.pos.y = yTarget
      target.z = INDICES.TARGETS[index]
      xTarget -= 168
    })

    const minusPadding = stageWidth - (padding * 2)
    const unit = minusPadding / (this.playAreas.length - 1)
    const yPlay = 384
    let xPlay = padding
    this.playAreas.forEach((play, index) => {
      play.pos.x = xPlay
      play.pos.y = yPlay
      play.z = INDICES.PLAYS[index]
      xPlay += unit
    })

    const position = engine.input.pointers.at(0).lastScreenPos
    this.temporary.pos.x = position.x
    this.temporary.pos.y = position.y
  }

  override onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed)

    if (!this.quitButton) {
      this.quitButton = ui.root.querySelector<HTMLButtonElement>('#quit-button')
      this.quitButton?.addEventListener('click', this.onQuitClick)
    }

    if (!this.redealButton) {
      this.redealButton = ui.root.querySelector<HTMLButtonElement>('#redeal-button')
      this.redealButton?.addEventListener('click', this.onRedealClick)
    }

    if (!this.resetButton) {
      this.resetButton = ui.root.querySelector<HTMLButtonElement>('#reset-button')
      this.resetButton?.addEventListener('click', this.onRestartClick)
    }

    const hasWon = this.targets.reduce((win, target) => {
      return win && (target.lastCard as CardObject)?.value === KING
    }, true)

    if (hasWon) {
      this.winGame()
    }
  }

  private debug() {
    // @ts-ignore
    window['g'] = { deck: this.deckAnchor, plays: this.playAreas, targets: this.targets, display: this.displayAnchor, cards: this.cards, temporary: this.temporary }
  }

  private onQuitClick = () => {
    if (this.dealing) return
    this.clearArea()
    this.engine.goToScene('menu')
  }

  private onRedealClick = () => {
    if (this.dealing) return
    this.clearArea()
    game.plays += 1
    game.attempts = 1
    game.shuffle()
    this.dealCards()
  }

  private onRestartClick = () => {
    if (this.dealing) return
    this.clearArea()
    game.attempts += 1
    game.reset(this.originalCardOrder)
    this.dealCards()
  }

  private clearArea = () => {
    const anchors = [
      this.deckAnchor,
      this.displayAnchor,
      this.displayAnchor2,
      this.displayAnchor3,
      ...this.targets,
      ...this.playAreas
    ]

    anchors.forEach(a => a.next = null)
    this.cards.forEach((card) => {
      this.remove(card)
    })
    this.cards = []
  }

  private winGame = () => {
    const cards = this.targets.map((card) => {
      return card.tree().map(stackable => {
        const card = stackable as CardObject
        return card.card
      })
    })

    this.clearArea()
    this.engine.goToScene('gameOverAnimating', { sceneActivationData: cards })
  }

  private debugSolve() {
    const order = [ ...values ]
    const ace = order.pop()
    if (ace) order.unshift(ace)
    let count = 0

    order.forEach((value) => {
      const cards = this.cards.filter(c => c.value === value)
      cards.forEach(card => {
        const target = this.targets[suits.indexOf(card.suit)]
        card.flip()
        if (count < 51) {
          target.attach(card)
        } else {
          this.playAreas[this.playAreas.length - 1].next = null
          this.playAreas[this.playAreas.length - 1].attach(card)
        }
        count++
      })
    })
  }
}