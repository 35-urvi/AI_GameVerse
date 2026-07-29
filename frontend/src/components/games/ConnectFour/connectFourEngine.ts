import type {
  ConnectFourBoard,
  ConnectFourCell,
  ConnectFourPlayer,
} from "@/types/connectFour";

import {
  ROWS,
  COLUMNS,
  EMPTY,
} from "@/types/connectFour";


export const createEmptyBoard =
  (): ConnectFourBoard => {
    return Array.from(
      { length: ROWS },
      () =>
        Array<ConnectFourCell>(
          COLUMNS,
        ).fill(EMPTY),
    );
  };


export const getNextOpenRow = (
  board: ConnectFourBoard,
  column: number,
): number => {
  for (
    let row = ROWS - 1;
    row >= 0;
    row--
  ) {
    if (
      board[row][column] === EMPTY
    ) {
      return row;
    }
  }

  return -1;
};


export const makeMove = (
  board: ConnectFourBoard,
  column: number,
  player: ConnectFourPlayer,
): ConnectFourBoard | null => {
  const row =
    getNextOpenRow(
      board,
      column,
    );

  if (row === -1) {
    return null;
  }

  const newBoard =
    board.map(
      (currentRow) =>
        [...currentRow],
    );

  newBoard[row][column] =
    player;

  return newBoard;
};


export const getWinningLine = (
  board: ConnectFourBoard,
  row: number,
  column: number,
  player: ConnectFourPlayer,
): Array<{
  row: number;
  column: number;
}> => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (
    const [
      rowDirection,
      columnDirection,
    ] of directions
  ) {
    const positions = [
      {
        row,
        column,
      },
    ];

    let nextRow =
      row + rowDirection;

    let nextColumn =
      column + columnDirection;

    while (
      nextRow >= 0 &&
      nextRow < ROWS &&
      nextColumn >= 0 &&
      nextColumn < COLUMNS &&
      board[nextRow][nextColumn] === player
    ) {
      positions.push({
        row: nextRow,
        column: nextColumn,
      });

      nextRow += rowDirection;

      nextColumn +=
        columnDirection;
    }

    nextRow =
      row - rowDirection;

    nextColumn =
      column - columnDirection;

    while (
      nextRow >= 0 &&
      nextRow < ROWS &&
      nextColumn >= 0 &&
      nextColumn < COLUMNS &&
      board[nextRow][nextColumn] === player
    ) {
      positions.push({
        row: nextRow,
        column: nextColumn,
      });

      nextRow -= rowDirection;

      nextColumn -=
        columnDirection;
    }

    if (
      positions.length >= 4
    ) {
      return positions;
    }
  }

  return [];
};


export const checkGameResult = (
  board: ConnectFourBoard,
) => {
  for (
    let row = 0;
    row < ROWS;
    row++
  ) {
    for (
      let column = 0;
      column < COLUMNS;
      column++
    ) {
      const cell =
        board[row][column];

      if (
        cell === EMPTY
      ) {
        continue;
      }

      const winningLine =
        getWinningLine(
          board,
          row,
          column,
          cell,
        );

      if (
        winningLine.length >= 4
      ) {
        return {
          winner: cell,
          winningLine,
          isDraw: false,
        };
      }
    }
  }

  const isDraw =
    board[0].every(
      (cell) =>
        cell !== EMPTY,
    );

  return {
    winner: null,
    winningLine: [],
    isDraw,
  };
};