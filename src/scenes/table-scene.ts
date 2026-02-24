import { Actor, Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";
import { StraightCardAnchor } from "../objects/straight-card-anchor";
import { GameData } from "../data/game-data";
import { HangingCardAnchor } from "../objects/hanging-card-anchor";
import { times } from "../utils/times";
import { CardObject } from "../objects/card-object";
import { CardSide } from "../data/card-side";
import { EmptyStack } from "../objects/empty-stack";
import { StackShadow } from "../objects/stack-shadow";
import { DealMaker } from "../data/deal-maker";
import { Dealer } from "../data/dealer";
import { ShowThreeAnchor } from "../objects/show-three-anchor";
import { StackManager } from "../objects/stack-manager";
import { FlipCardManager } from "../objects/flip-card-manager";
import { CountUpStrategy } from "../objects/count-up-strategy";
import { AlternatingColorStrategy } from "../objects/alternating-color-strategy";

const game = GameData.getInstance()
const width = 128
const height = 192

const INDICES = {
  CATCHALL: 0,
  EMPTY_DECK: -100,
  DECK: 10,
  PILE_SHADOW: -100,
  PILE: 20,

  TARGETS: [200, 400, 600, 800],
  PLAYS: [1000, 1200, 1400, 1600, 1800, 2000, 2200],
  FLOATING: 2400,
}

export class TableScene extends Scene {
  private deckAnchor = new StraightCardAnchor({ name: 'DeckAnchor', width, height })
  private displayAnchor = new ShowThreeAnchor({ name: 'DisplayAnchor', width, height })
  private playAreas: HangingCardAnchor[] = times(7).map((_, index) => new HangingCardAnchor({ name: `PlayArea${index}`, width, height }))
  private targets: HangingCardAnchor[] = times(4).map((_, index) => new StraightCardAnchor({ name: `TargetArea${index}`, width, height }))
  private temporary = new HangingCardAnchor({ name: 'TemporaryStorage', width, height, z: INDICES.FLOATING })
  private cards: CardObject[] = []
  private dealer = new Dealer(this.deckAnchor, this.playAreas)
  private stackManager?: StackManager
  private flipCardManager?: FlipCardManager
  private countUpStrategy = new CountUpStrategy()
  private alternatingColorStrategy = new AlternatingColorStrategy()

  onInitialize(engine: Engine): void {
    super.onInitialize(engine)
    this.backgroundColor = Color.fromHex('#146e2d')

    const flipCardManager = new FlipCardManager()
    const stackManager = new StackManager(this.temporary)
    stackManager.addStack(this.deckAnchor)
    stackManager.addStack(this.displayAnchor)
    this.temporary.forceCards = true

    new DealMaker(this.deckAnchor, this.displayAnchor)

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
    })

    this.stackManager = stackManager
    this.flipCardManager = flipCardManager
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    this.positionAssets(engine)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.positionAssets(context.engine)
    this.debug()

    this.add(this.deckAnchor)
    this.add(this.displayAnchor)
    this.add(this.temporary)
    this.playAreas.forEach(a => this.add(a))
    this.targets.forEach(a => this.add(a))

    game.shuffle()
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
      this.flipCardManager?.addCard(card)
      this.stackManager?.addCard(card)
      this.add(card)
      cardData = game.deal()
    }

    this.dealer.deal()
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
  }

  private positionAssets(engine: Engine) {
    const stageWidth = engine.screen.width
    const padding = 96
    this.deckAnchor.pos.x = 96
    this.deckAnchor.pos.y = 112
    this.displayAnchor.pos.x = this.deckAnchor.pos.x + 168
    this.displayAnchor.pos.y = this.deckAnchor.pos.y
    this.deckAnchor.z = INDICES.DECK
    this.displayAnchor.z = INDICES.PILE

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

  private debug() {
    // @ts-ignore
    window['g'] = { deck: this.deckAnchor, plays: this.playAreas, targets: this.targets, display: this.displayAnchor, cards: this.cards, temporary: this.temporary }
  }
}