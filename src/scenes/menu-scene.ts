import { Color, Engine, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { GameData } from "../data/game-data";
import { ButtonBackdrop } from "../objects/button-backdrop";

const game = GameData.getInstance()

export class MenuScene extends Scene {
  backgroundColor = Color.Azure

  private titleLabel = game.titleFactory.create('Solitaire', TextAlign.Center, Color.White)
  private playButton = game.controlFactory.create('PLAY', TextAlign.Center, Color.White)
  private dealLabel = game.controlFactory.create('Deal', TextAlign.Center, Color.White)
  private dealOne = game.controlFactory.create('One', TextAlign.Right, Color.White)
  private dealThree = game.controlFactory.create('Three', TextAlign.Left, Color.White)
  private dealSettingMarker = new ButtonBackdrop()

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)

    this.add(this.titleLabel)
    this.add(this.playButton)
    this.add(this.dealLabel)
    this.add(this.dealOne)
    this.add(this.dealThree)
    this.add(this.dealSettingMarker)

    if (game.dealCount === 3) {
      this.dealSettingMarker.connectedCompoennt = this.dealThree
    } else {
      this.dealSettingMarker.connectedCompoennt = this.dealOne
    }

    this.dealOne.on('pointerup', this.onDealOne)
    this.dealThree.on('pointerup', this.onDealThree)
    this.playButton.on('pointerup', this.onPlay)
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)

    this.remove(this.titleLabel)
    this.remove(this.playButton)
    this.remove(this.dealLabel)
    this.remove(this.dealOne)
    this.remove(this.dealThree)
    this.remove(this.dealSettingMarker)

    this.dealOne.off('pointerup', this.onDealOne)
    this.dealThree.off('pointerup', this.onDealThree)
    this.playButton.off('pointerup', this.onPlay)
  }

  override onPostUpdate(engine: Engine, elapsed: number): void {
    const width = engine.screen.width
    const height = engine.screen.height
    const halfWidth = width / 2
    const halfHeight = height / 2
    const titleVector = vec(halfWidth, halfHeight - 100)
    const playVector = vec(titleVector.x, titleVector.y + 100)
    const dealLabelVector = vec(playVector.x, playVector.y + 50)
    const dealOneVector = vec(dealLabelVector.x - 10, dealLabelVector.y + 40)
    const dealThreeVector = vec(dealLabelVector.x + 10, dealLabelVector.y + 40)

    this.titleLabel.pos = titleVector
    this.playButton.pos = playVector
    this.dealLabel.pos = dealLabelVector
    this.dealOne.pos = dealOneVector
    this.dealThree.pos = dealThreeVector
  }

  private onDealOne = () => {
    game.dealCount = 1
  }

  private onDealThree = () => {
    game.dealCount = 3
  }

  private onPlay = () => {
    this.engine.goToScene('table')
  }
}