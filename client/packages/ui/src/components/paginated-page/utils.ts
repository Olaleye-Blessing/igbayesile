export const DOTS = "...";

export const range = ({ start, end }: { start: number; end: number }) =>
  Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
