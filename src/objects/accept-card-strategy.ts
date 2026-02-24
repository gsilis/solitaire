import { CardObject } from "./card-object";

export interface AcceptCardStrategy {
  acceptCard(tree: CardObject[], card: CardObject): boolean
}