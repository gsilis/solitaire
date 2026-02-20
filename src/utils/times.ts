export function times<T>(count: number, fill?: T): (T | null)[] {
  const arr = []
  const filler = fill === undefined ? null : fill
  for (let i = 0; i < count; i++) {
    arr.push(filler)
  }
  return arr
}