export function times<T>(count: number, fill?: T): (T | null)[] {
  const arr = []
  const filler = fill === undefined ? null : fill
  for (let i = 0; i < count; i++) {
    arr.push(filler)
  }
  return arr
}

export function timesWithIndex(count: number): number[] {
  const arr: number[] = []
  for (let i = 0; i < count; i++) {
    arr.push(i)
  }
  return arr
}