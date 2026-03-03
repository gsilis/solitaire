import { Scene } from "excalibur";
import { CardAnchor } from "./card-anchor";
import { PhantomCard } from "./phantom-card";
import { CardGraphic } from "../../graphics/card-graphic";
import { GameData } from "../../data/game-data";
import { Card } from "../../card-shoe/cards/card";

export class GameDeck {
  private scene: Scene
  private deck: CardAnchor
  private phantoms: PhantomCard[] = []
  private graphics: CardGraphic[] = []

  constructor(scene: Scene, deck: CardAnchor) {
    this.deck = deck
    this.scene = scene
  }

  setup(game: GameData): PhantomCard[] {
    let card: Card | void

    while (card = game.deal()) {
      const source = new CardGraphic({ card })
      const phantom = new PhantomCard({ source })

      this.phantoms.push(phantom)
      this.graphics.push(source)

      this.scene.add(source)
      this.scene.add(phantom)
      this.deck.attach(phantom)
    }

    return this.phantoms
  }

  teardown() {
    [...this.phantoms, ...this.graphics].forEach(a => this.scene.remove(a))
    this.phantoms = []
    this.graphics = []
  }
}