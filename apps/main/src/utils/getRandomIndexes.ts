export const getRandomIndexes = (count: number, max: number): number[] => {
  const indexes = new Set<number>();

  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * max));
  }

  return Array.from(indexes).sort((a, b) => a - b);
};
