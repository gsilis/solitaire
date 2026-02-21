export interface Stackable {
  setNext(stackable: Stackable | null): void
  next(): Stackable | null
  tree(): Stackable[]
}