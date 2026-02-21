export interface Stackable {
  get next(): Stackable | null
  set next(stackable: Stackable | null)
  tree(): Stackable[]
}