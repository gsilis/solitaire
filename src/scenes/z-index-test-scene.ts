import { Color, Scene, SceneActivationContext, vec } from "excalibur";
import { IndexGraphic } from "../objects/index-graphic";

export class ZIndexTestScene extends Scene {
  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    const center = context.engine.screen.center
    const coordinates: [number, number, number, Color][] = [
      [-200, -200, 100, Color.Red],
      [-130, -130, 90, Color.Blue],
      [-60, -60, 80, Color.Green],
      [10, 10, 70, Color.Yellow],
      [80, 80, 60, Color.Orange],
      [150, 150, 50, Color.Rose]
    ]

    const innerBox = new IndexGraphic()
    const boxes = coordinates.map((coordinate, index) => {
      const coord = center.clone()
      coord.x += coordinate[0]
      coord.y += coordinate[1]

      const box = new IndexGraphic({ pos: coord })
      box.z = coordinate[2]
      box.col = coordinate[3]
      if (index === 2) {
        // box.addChild(innerBox)
      }
      this.add(box)
      return box
    })

    const targetBox = boxes[2]
    const coordinate = targetBox.pos.clone()
    const innerBoxCoordinate = coordinate.clone()

    innerBox.pos = vec(-170, 20)
    innerBox.z = targetBox.z - 90
    innerBox.col = Color.Brown
    targetBox.addChild(innerBox)
  }
}