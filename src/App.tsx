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
  const [tileBeingDragged, setTileBeingDragged] = useState<EventTarget | null>(
    null
  );
  const [tileBeingReplaced, setTileBeingReplaced] =
    useState<EventTarget | null>(null);

  const popTiles = (tiles: number[]) => {
    tiles.forEach((square) => {
      const tile: HTMLImageElement = document.querySelector(
        `[data-id="${square}"]`
      ) as HTMLImageElement;
      tile.classList.add("pop");
      setTimeout(() => {
        tile.classList.remove("pop");
      }, 300);
    });
  };

  const checkForColumnOfThree = () => {
    const maxColumnIndex: number = width * (width - 2) - 1; // should be 47 for a width of 8
    for (let i = 0; i <= maxColumnIndex; i++) {
      const columnOfThree: number[] = [i, i + width, i + width * 2]; // the indexes of the three tiles in the column
      const decidedColor: string = board[i]; // the color of the first tile in the column

      if (columnOfThree.every((square) => board[square] === decidedColor)) {
        // we have a match

        // add pop animation to the matched tiles
        popTiles(columnOfThree);

        columnOfThree.forEach((square) => (board[square] = "")); // remove the tiles
        return true;
      }
    }
    return false;
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


        // add pop animation to the matched tiles
        popTiles(columnOfFour);

        columnOfFour.forEach((square) => (board[square] = "")); // remove the tiles
        return true;
      }
    }
    return false;
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfThree: number[] = [i, i + 1, i + 2]; // the indexes of the three tiles in the row
      const decidedColor: string = board[i]; // the color of the first tile in the row

      // ignore the last two tiles in a row
      const ignoreConditions: boolean =
        (i + 1) % width === 0 || (i + 2) % width === 0;

      if (ignoreConditions) continue;

      if (rowOfThree.every((square) => board[square] === decidedColor)) {
        // we have a match

        // add pop animation to the matched tiles
        popTiles(rowOfThree);

        rowOfThree.forEach((square) => (board[square] = "")); // remove the tiles
        return true;
      }
    }
    return false;
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfFour: number[] = [i, i + 1, i + 2, i + 3]; // the indexes of the four tiles in the row
      const decidedColor: string = board[i]; // the color of the first tile in the row

      // ignore the last three tiles in a row
      const ignoreConditions: boolean =
        (i + 1) % width === 0 || (i + 2) % width === 0 || (i + 3) % width === 0;

      if (ignoreConditions) continue;

      if (rowOfFour.every((square) => board[square] === decidedColor)) {
        // we have a match

        // add pop animation to the matched tiles
        popTiles(rowOfFour);

        rowOfFour.forEach((square) => (board[square] = "")); // remove the tiles
        return true;
      }
    }
    return false;
  };

  const replenishTopRow = () => {
    for (let i = 0; i < width; i++) {
      if (board[i] === "") {
        board[i] = tileColors[Math.floor(Math.random() * tileColors.length)];
      }
    }
  };

  // move the tile into the square below it if it is empty
  const moveIntoSquareBelow = () => {
    for (let i = 0; i < width * width - width; i++) {
      // create array [0, 1, 2, 3, 4, 5, 6, 7] for the first row in width 8
      // const firstRow: number[] = Array.from({ length: width }, (_, idx) => idx);
      // if(firstRow.includes(i) && board[i] === "") {
      //   // we are in the first row
      //   // set a random color for the empty tile
      //   board[i] = tileColors[Math.floor(Math.random() * tileColors.length)];
      // }

      // if the square below is empty, move the tile into it and set the current square to empty
      if (board[i + width] === "") {
        board[i + width] = board[i];
        board[i] = "";
      }
    }
  };

  const dragStart = (e: React.DragEvent<HTMLImageElement>) => {
    console.log("drag start");
    setTileBeingDragged(e.target);
  };

  const dragDrop = (e: React.DragEvent<HTMLImageElement>) => {
    console.log("drag drop");
    setTileBeingReplaced(e.target);
  };

  const dragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    console.log("drag end");

    // get the indexes of the tiles being dragged and replaced
    const tileBeingDraggedIndex: number = Number(
      (tileBeingDragged as HTMLImageElement).getAttribute("data-id")
    );
    const tileBeingReplacedIndex: number = Number(
      (tileBeingReplaced as HTMLImageElement).getAttribute("data-id")
    );

    console.log(tileBeingDraggedIndex, tileBeingReplacedIndex);

    const validMoves: number[] = [
      tileBeingDraggedIndex - 1,
      tileBeingDraggedIndex + 1,
      tileBeingDraggedIndex - width,
      tileBeingDraggedIndex + width,
    ];

    // initially swap the colors in the board
    board[tileBeingReplacedIndex] = (
      tileBeingDragged as HTMLImageElement
    ).style.backgroundColor;
    board[tileBeingDraggedIndex] = (
      tileBeingReplaced as HTMLImageElement
    ).style.backgroundColor;

    const isValidMove: boolean =
      validMoves.includes(tileBeingReplacedIndex) &&
      (checkForColumnOfThree() ||
        checkForColumnOfFour() ||
        checkForRowOfThree() ||
        checkForRowOfFour());

    if (tileBeingDragged && tileBeingReplaced) {
      if (isValidMove) {
        // reset the tileBeingDragged and tileBeingReplaced states and scales
        (tileBeingDragged as HTMLImageElement).style.transform = "unset";
        (tileBeingReplaced as HTMLImageElement).style.transform = "unset";
        setTileBeingDragged(null);
        setTileBeingReplaced(null);
      } else {

        (tileBeingReplaced as HTMLImageElement).classList.add("invalidMove");
        setTimeout(() => {
          (tileBeingReplaced as HTMLImageElement).classList.remove("invalidMove");
        }, 300);


        // set the colors back to their original positions
        (tileBeingDragged as HTMLImageElement).style.transform = "unset";
        (tileBeingReplaced as HTMLImageElement).style.transform = "unset";
        board[tileBeingReplacedIndex] = (
          tileBeingReplaced as HTMLImageElement
        ).style.backgroundColor;
        board[tileBeingDraggedIndex] = (
          tileBeingDragged as HTMLImageElement
        ).style.backgroundColor;
        setBoard([...board]);
      }
    }
  };

  const dragEnter = (e: React.DragEvent<HTMLImageElement>) => {
    // scale the tile on the target to indicate that it is the target
    e.currentTarget.style.transform = "scale(1.5)";
    e.currentTarget.style.transition = "transform 0.3s";
  }

  const dragLeave = (e: React.DragEvent<HTMLImageElement>) => {
    // reset the scale of the tile
    e.currentTarget.style.transform = "unset";
  }

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
      moveIntoSquareBelow();
      replenishTopRow();
      setBoard([...board]);
    }, 100);
    // clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [
    checkForColumnOfThree,
    checkForColumnOfFour,
    checkForRowOfThree,
    checkForRowOfFour,
    moveIntoSquareBelow,
    replenishTopRow,
    board,
  ]);

  return (
    <div className="app">
      <div className="game">
        {board.map((color: string, index: number) => {
          return (
            <img
              key={index}
              alt={String(index)}
              style={{ backgroundColor: color }}
              data-id={index}
              draggable="true"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              
              onDragStart={dragStart}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
