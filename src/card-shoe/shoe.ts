import { Card } from "./cards/card";
import { Deck } from "./cards/deck";
import { randomize, fill, shuffle } from "./utils/array";

export class Shoe {
  private _cards: Card[] = [];
  private _shuffled = false;

  constructor(
    private _decks: number = 3
  ) {
    this.fill();
  }

  set decks(value: number) {
    this._decks = value;
    this.fill();
  }

  get decks(): number {
    return this._decks;
  }

  get shuffled(): boolean {
    return this._shuffled;
  }

  get remaining(): number {
    return this._cards.length;
  }

  get total(): number {
    return this._decks * Deck.size;
  }

  get percentage(): number {
    return this.remaining / this.total;
  }

  shuffle(repeat: number = 3) {
    fill(repeat).forEach(() => {
      this._cards = shuffle(randomize(this._cards));
    });
    this._shuffled = true;
  }

  deal(): Card | void {
    if (!this._shuffled) {
      console.warn('Dealing from an unshuffled shoe!');
    }

    return this._cards.pop();
  }

  currentOrder(): Card[] {
    return [...this._cards]
  }

  acceptSnapshot(cards: Card[]) {
    this._cards = cards
  }

  private fill() {
    this._shuffled = false;
    this._cards = fill(this.decks).reduce((cards: Card[]) => {
      return [
        ...cards,
        ...Deck.generateCards(),
      ];
    }, []);
  }
}