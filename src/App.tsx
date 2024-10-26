import React, { useEffect, useState } from "react";
const width: number = 8;
const tileColors: string[] = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow",
];

const App = () => {
  const [board, setBoard] = useState<string[]>([]);

  const checkForColumnOfThree = () => {
    const maxColumnIndex: number = width * (width - 2) - 1; // should be 47 for a width of 8
    console.log(maxColumnIndex);
    for (let i = 0; i <= maxColumnIndex; i++) {
      const columnOfThree: number[] = [i, i + width, i + width * 2]; // the indexes of the three tiles in the column
      const decidedColor: string = board[i]; // the color of the first tile in the column

      if (columnOfThree.every((square) => board[square] === decidedColor)) {
        // we have a match
        columnOfThree.forEach((square) => (board[square] = "")); // remove the tiles
      }
    }
  };

  const checkForColumnOfFour = () => {
    const maxColumnIndex: number = width * (width - 3) - 1; // should be 39 for a width of 8
    for (let i = 0; i <= maxColumnIndex; i++) {
      const columnOfFour: number[] = [
        i,
        i + width,
        i + width * 2,
        i + width * 3,
      ]; // the indexes of the four tiles in the column
      const decidedColor: string = board[i]; // the color of the first tile in the column

      if (columnOfFour.every((square) => board[square] === decidedColor)) {
        // we have a match
        columnOfFour.forEach((square) => (board[square] = "")); // remove the tiles
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfThree: number[] = [i, i + 1, i + 2]; // the indexes of the three tiles in the row
      const decidedColor: string = board[i]; // the color of the first tile in the row

      // ignore the last two tiles in a row
      const ignoreConditions: boolean =
        (i + 1) % width === 0 || (i + 2) % width === 0;

      if(ignoreConditions) continue

      if (rowOfThree.every((square) => board[square] === decidedColor)) {
        // we have a match
        rowOfThree.forEach((square) => (board[square] = "")); // remove the tiles
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfFour: number[] = [i, i + 1, i + 2, i + 3]; // the indexes of the four tiles in the row
      const decidedColor: string = board[i]; // the color of the first tile in the row

      // ignore the last three tiles in a row
      const ignoreConditions: boolean =
        (i + 1) % width === 0 ||
        (i + 2) % width === 0 ||
        (i + 3) % width === 0;

      if(ignoreConditions) continue

      if (rowOfFour.every((square) => board[square] === decidedColor)) {
        // we have a match
        rowOfFour.forEach((square) => (board[square] = "")); // remove the tiles
      }
    }
  };

  const createBoard = () => {
    const board: string[] = [];
    for (let i = 0; i < width * width; i++) {
      // get a random color from the tileColors array
      const randomColor: string =
        tileColors[Math.floor(Math.random() * tileColors.length)];
      board.push(randomColor);
    }
    setBoard(board);
  };

  // create the board when the component mounts
  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      setBoard([...board]);
    }, 100);
    // clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [checkForColumnOfThree, checkForColumnOfFour, checkForRowOfThree, checkForRowOfFour
    , board]);

  return (
    <div className="app">
      <div className="game">
        {board.map((color: string, index: number) => {
          return (
            <img
              key={index}
              alt={String(index)}
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
