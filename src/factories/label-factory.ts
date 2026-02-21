import { Color, Font, Label, TextAlign } from "excalibur";

export class LabelFactory {
  private _font: Font

  constructor(font: Font) {
    this._font = font
  }

  create(text: string, align?: TextAlign, color?: Color) {
    const copyFont = this._font.clone()
    const opts: {
      font: Font,
      text: string,
      color?: Color,
    } = { font: copyFont, text }

    if (color) opts['color'] = color
    const label = new Label(opts)
    if (align) label.font.textAlign = align
    label.font.bold = true

    return label
  }
}