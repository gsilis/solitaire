import { Card, Suit, suits, Value, values } from "./card";

export class Deck {
  static readonly deck: Card[] = suits.reduce((deck: Card[], suit: Suit) => {
    values.forEach((value: Value) => {
      deck.push(new Card(suit, value));
    });

    return deck;
  }, []);

  static size = 52;

  static generateCards(): Card[] {
    return this.deck.map(d => d.clone());
  }
}