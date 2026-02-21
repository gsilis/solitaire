import { Engine, Scene, SceneActivationContext } from "excalibur";
import { StraightCardAnchor } from "../objects/straight-card-anchor";
import { GameData } from "../data/game-data";
import { HangingCardAnchor } from "../objects/hanging-card-anchor";
import { times } from "../utils/times";
import { CardObject } from "../objects/card-object";
import { CardSide } from "../data/card-side";
import { EmptyStack } from "../objects/empty-stack";
import { StackShadow } from "../objects/stack-shadow";

const game = GameData.getInstance()
const width = 128
const height = 192

export class TableScene extends Scene {
  private deckAnchor = new StraightCardAnchor({ name: 'DeckAnchor', width, height })
  private displayAnchor = new StraightCardAnchor({ name: 'DisplayAnchor', width, height })
  private playAreas: HangingCardAnchor[] = times(7).map((_, index) => new HangingCardAnchor({ name: `PlayArea${index}`, width, height }))
  private targets: HangingCardAnchor[] = times(4).map((_, index) => new StraightCardAnchor({ name: `TargetArea${index}`, width, height }))
  private temporary = new HangingCardAnchor({ name: 'TemporaryStorage', width, height })
  private cards: CardObject[] = []

  onInitialize(engine: Engine): void {
    super.onInitialize(engine)

    this.deckAnchor.addChild(new EmptyStack())
    this.displayAnchor.addChild(new StackShadow())
    this.playAreas.forEach(play => {
      play.addChild(new StackShadow())
    })
    this.targets.forEach(target => {
      target.addChild(new StackShadow())
    })
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)

    const stageWidth = engine.screen.width
    const padding = 96
    this.deckAnchor.pos.x = 96
    this.deckAnchor.pos.y = 112
    this.displayAnchor.pos.x = this.deckAnchor.pos.x + 168
    this.displayAnchor.pos.y = this.deckAnchor.pos.y

    const yTarget = this.deckAnchor.pos.y
    let xTarget = engine.screen.width - padding
    this.targets.forEach(target => {
      target.pos.x = xTarget
      target.pos.y = yTarget
      xTarget -= 168
    })

    const minusPadding = stageWidth - (padding * 2)
    const unit = minusPadding / (this.playAreas.length - 1)
    const yPlay = 384
    let xPlay = padding
    this.playAreas.forEach(play => {
      play.pos.x = xPlay
      play.pos.y = yPlay
      xPlay += unit
    })

    const position = engine.input.pointers.at(0).lastScreenPos
    this.temporary.pos.x = position.x + (width / 2) + 16
    this.temporary.pos.y = position.y + (height / 2) + 16
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

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
      })

      this.cards.push(card)
      this.deckAnchor.last.next = card
      this.add(card)
      cardData = game.deal()
    }
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

  private debug() {
    // @ts-ignore
    window['g'] = { deck: this.deckAnchor, plays: this.playAreas, targets: this.targets, display: this.displayAnchor, cards: this.cards }
  }
}