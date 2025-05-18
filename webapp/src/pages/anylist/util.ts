import { AnylistColumns } from "@lib/boardgame.api.client";

export function getMaxId(list: AnylistColumns[]): number {
  let largestId = 0;
  list.forEach((i) => {
    const numericId = Number(i.id);
    if (numericId > largestId) {
      largestId = numericId;
    }
  });

  return largestId + 1;
}
