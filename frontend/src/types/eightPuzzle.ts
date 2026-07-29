export type PuzzleTile = number;


export type PuzzleBoard = [
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
  PuzzleTile,
];


export type PuzzleSolveResponse = {
  solution: PuzzleBoard[];
  moves: number;
};