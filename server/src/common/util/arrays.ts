export function hasDuplicateId(array: { id: string }[]): boolean {
  const ids = array.map((i) => i.id);
  return hasDuplicate(ids);
}

export function hasDuplicate(array: string[]): boolean {
  return new Set(array).size !== array.length;
}
