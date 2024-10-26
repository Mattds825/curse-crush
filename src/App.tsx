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

  const createBoard = () => {
    const board: string[] = [];
    for (let i = 0; i < width * width; i++) {
      // get a random color from the tileColors array
      const randomColor: string = tileColors[Math.floor(Math.random() * tileColors.length)];
      board.push(randomColor);
    }
    setBoard(board);
  };

  // create the board when the component mounts
  useEffect(() => {
    createBoard();
  },[])

  return <div className="app">
    <div className="game">
      {board.map((color: string, index: number) => {
        return <img key={index} alt={color} style={{backgroundColor: color}}/>
      })}
    </div>
  </div>;
};

export default App;
