import React, { useEffect, useRef, useState } from "react";
import Tile from "./components/Tile";
import PoemModal from "./components/PoemModal";
const width: number = 8;
const tileColors: string[] = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow",
];
const poem = `In the darkest night, where wisdom owls soar,
A creature whispers secrets, but tell me, what Fo(u)r?.
When the sky reveals a guiding star,
Its sparkle whispers softly three wishes afar.
On cliffs where the horned one stands with might,
Face it with courage, again, again, again, again, and again you fight.
In shadows deep, where beetles crawl,
Two hushed steps, then the shattering fall.
A single eye sees all that’s true,
It blinks, it stares thrice it glares
And at the end, a key for the locks,
One strike alone the door unlocks…`;

enum direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const App = () => {
  const [board, setBoard] = useState<string[]>([]);
  const [tileBeingDragged, setTileBeingDragged] = useState<EventTarget | null>(
    null
  );
  const [tileBeingReplaced, setTileBeingReplaced] =
    useState<EventTarget | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showPoemModal, setShowPoemModal] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [poemWords, setPoemWords] = useState<string[]>([]);
  const [poemWordsCoordinates, setPoemWordsCoordinates] = useState<{
    [key: string]: {
      x: number | undefined;
      y: number | undefined;
      dir: direction;
    };
  }>({});

  const [isChainPopping, setIsChainPopping] = useState<boolean>(false);

  const initialSymbolDataMaps = {
    owl: {
      color: "green",
      poem: "In the darkest night, where wisdom owls soar",
      discovered: false,
      symbol: "𓅔",
      currAmount: 0,
      targetAmount: 4,
    },
    star: {
      color: "blue",
      poem: "When the sky reveals a guiding star",
      discovered: false,
      symbol: "𖤐",
      currAmount: 0,
      targetAmount: 4,
    },
    goat: {
      color: "orange",
      poem: "On cliffs where the horned one stands with might",
      discovered: false,
      symbol: "𓃶",
      currAmount: 0,
      targetAmount: 4,
    },
    beetle: {
      color: "purple",
      poem: "In shadows deep, where beetles crawl",
      discovered: false,
      symbol: "𓆣",
      currAmount: 0,
      targetAmount: 4,
    },
    eye: {
      color: "red",
      poem: "A single eye sees all that’s true",
      discovered: false,
      symbol: "𓁿",
      currAmount: 0,
      targetAmount: 4,
    },
    key: {
      color: "yellow",
      poem: "And at the end, a key for the locks",
      discovered: false,
      symbol: "𓋹",
      currAmount: 0,
      targetAmount: 4,
    },
  };

  const [symbolDataMaps, setSymbolDataMaps] = useState<{
    [key: string]: {
      color: string;
      poem: string;
      discovered: boolean;
      symbol: string;
      currAmount: number;
      targetAmount: number;
    };
  }>({
    owl: {
      color: "green",
      poem: "In the darkest night, where wisdom owls soar",
      discovered: false,
      symbol: "𓅔",
      currAmount: 0,
      targetAmount: 4,
    },
    star: {
      color: "blue",
      poem: "When the sky reveals a guiding star",
      discovered: false,
      symbol: "𖤐",
      currAmount: 0,
      targetAmount: 4,
    },
    goat: {
      color: "orange",
      poem: "On cliffs where the horned one stands with might",
      discovered: false,
      symbol: "𓃶",
      currAmount: 0,
      targetAmount: 4,
    },
    beetle: {
      color: "purple",
      poem: "In shadows deep, where beetles crawl",
      discovered: false,
      symbol: "𓆣",
      currAmount: 0,
      targetAmount: 4,
    },
    eye: {
      color: "red",
      poem: "A single eye sees all that’s true",
      discovered: false,
      symbol: "𓁿",
      currAmount: 0,
      targetAmount: 4,
    },
    key: {
      color: "yellow",
      poem: "And at the end, a key for the locks",
      discovered: false,
      symbol: "𓋹",
      currAmount: 0,
      targetAmount: 4,
    },
  });

  const [trackingSymbol, setTrackingSymbol] = useState<string>("owl");

  const popTiles = (tiles: number[]) => {
    tiles.forEach((square) => {
      const tile: HTMLElement = document.querySelector(
        `[data-id="${square}"]`
      ) as HTMLElement;
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
        setScore((prevScore) => prevScore + 3); // increment the score by 3
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
        console.log("checking for column of four");
        // add pop animation to the matched tiles
        popTiles(columnOfFour);

        columnOfFour.forEach((square) => (board[square] = "")); // remove the tiles
        setScore((prevScore) => prevScore + 4); // increment the score by 4
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
        setScore((prevScore) => prevScore + 3); // increment the score by 3
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
        console.log("checking for row of four");
        // add pop animation to the matched tiles
        popTiles(rowOfFour);

        rowOfFour.forEach((square) => (board[square] = "")); // remove the tiles
        setScore((prevScore) => prevScore + 4); // increment the score by 4
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
      // if the square below is empty, move the tile into it and set the current square to empty
      if (board[i + width] === "") {
        board[i + width] = board[i];

        // add slidedown animation to the tile
        const tile: HTMLElement = document.querySelector(
          `[data-id="${i}"]`
        ) as HTMLElement;
        tile.classList.add("slideDown");
        setTimeout(() => {
          tile.classList.remove("slideDown");
        }, 300);

        board[i] = "";
      }
    }
  };

  const dragStart = (e: React.DragEvent<HTMLElement>) => {
    console.log("drag start");
    setTileBeingDragged(e.target);
  };

  const dragDrop = (e: React.DragEvent<HTMLElement>) => {
    console.log("drag drop");
    setTileBeingReplaced(e.target);
  };

  const dragEnd = (e: React.DragEvent<HTMLElement>) => {
    console.log("drag end");

    // get the indexes of the tiles being dragged and replaced
    const tileBeingDraggedIndex: number = Number(
      (tileBeingDragged as HTMLElement).getAttribute("data-id")
    );
    const tileBeingReplacedIndex: number = Number(
      (tileBeingReplaced as HTMLElement).getAttribute("data-id")
    );

    console.log("drag end", tileBeingDraggedIndex, tileBeingReplacedIndex);
    console.log("drag end color", board[tileBeingDraggedIndex]);

    console.log("tracking color", symbolDataMaps[trackingSymbol].color);

    if (symbolDataMaps[trackingSymbol].color === board[tileBeingDraggedIndex]) {
      console.log(symbolDataMaps);
      console.log("incrementing");
      setSymbolDataMaps((prev) => ({
        ...prev,
        [trackingSymbol]: {
          ...prev[trackingSymbol],
          currAmount: prev[trackingSymbol].currAmount + 1,
        },
      }));
      console.log(symbolDataMaps[trackingSymbol].currAmount);
      if (
        symbolDataMaps[trackingSymbol].currAmount ===
        symbolDataMaps[trackingSymbol].targetAmount
      ) {
        setSymbolDataMaps((prev) => ({
          ...prev,
          [trackingSymbol]: { ...prev[trackingSymbol], discovered: true },
        }));
        // setTrackingSymbol("star");
        console.log("discovered");
      }
    }

    const validMoves: number[] = [
      tileBeingDraggedIndex - 1,
      tileBeingDraggedIndex + 1,
      tileBeingDraggedIndex - width,
      tileBeingDraggedIndex + width,
    ];

    // initially swap the colors in the board
    board[tileBeingReplacedIndex] = (
      tileBeingDragged as HTMLElement
    ).style.backgroundColor;
    board[tileBeingDraggedIndex] = (
      tileBeingReplaced as HTMLElement
    ).style.backgroundColor;

    const isValidMove: boolean =
      validMoves.includes(tileBeingReplacedIndex) &&
      (checkForColumnOfFour() ||
        checkForColumnOfThree() ||
        checkForRowOfFour() ||
        checkForRowOfThree());

    if (tileBeingDragged && tileBeingReplaced) {
      if (isValidMove) {
        setIsChainPopping(false);

        // reset the tileBeingDragged and tileBeingReplaced states and scales
        (tileBeingDragged as HTMLElement).style.transform = "unset";
        (tileBeingReplaced as HTMLElement).style.transform = "unset";
        setTileBeingDragged(null);
        setTileBeingReplaced(null);
      } else {
        (tileBeingReplaced as HTMLElement).classList.add("invalidMove");
        setTimeout(() => {
          (tileBeingReplaced as HTMLElement).classList.remove("invalidMove");
        }, 300);

        // set the colors back to their original positions
        (tileBeingDragged as HTMLElement).style.transform = "unset";
        (tileBeingReplaced as HTMLElement).style.transform = "unset";
        board[tileBeingReplacedIndex] = (
          tileBeingReplaced as HTMLElement
        ).style.backgroundColor;
        board[tileBeingDraggedIndex] = (
          tileBeingDragged as HTMLElement
        ).style.backgroundColor;
        setBoard([...board]);
      }
    }
  };

  const dragEnter = (e: React.DragEvent<HTMLElement>) => {
    // scale the tile on the target to indicate that it is the target
    e.currentTarget.style.transform = "scale(1.5)";
    e.currentTarget.style.transition = "transform 0.3s";
  };

  const dragLeave = (e: React.DragEvent<HTMLElement>) => {
    // reset the scale of the tile
    e.currentTarget.style.transform = "unset";
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

  const createPoemWords = () => {
    const words = poem.split(/\s+/);
    const randomWords = [];

    const randomWordsMap: {
      [key: string]: {
        x: number | undefined;
        y: number | undefined;
        dir: direction;
      };
    } = {};

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomDirection = Math.floor(Math.random() * 4);
      randomWords.push(words[randomIndex]);
      randomWordsMap[words[randomIndex]] = {
        x: undefined,
        y: undefined,
        dir: randomDirection,
      };
    }

    setPoemWordsCoordinates(randomWordsMap);
    setPoemWords(randomWords);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setContext(ctx);
    }
  };

  const drawPoemWordsFlashing = (frameCount: number) => {
    // this function 10 random words from the poem to the canvas
    const canvas = document.getElementById(
      "floatingWords"
    ) as HTMLCanvasElement;
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    poemWords.forEach((word) => {
      let x: number = 0;
      let y: number = 0;
      if (!poemWordsCoordinates[word].x || !poemWordsCoordinates[word].y) {
        x = Math.random() * canvas.width + Math.sin(frameCount * 0.01) * 10;
        y = Math.random() * canvas.height + Math.cos(frameCount * 0.01) * 10;
        poemWordsCoordinates[word].x = x;
        poemWordsCoordinates[word].y = y;
      } else if (
        poemWordsCoordinates[word].x > canvas.width ||
        poemWordsCoordinates[word].y > canvas.height ||
        poemWordsCoordinates[word].x < 0 ||
        poemWordsCoordinates[word].y < 0
      ) {
        x = Math.random() * canvas.width + Math.sin(frameCount * 0.01) * 10;
        y = Math.random() * canvas.height + Math.cos(frameCount * 0.01) * 10;
        poemWordsCoordinates[word].x = x;
        poemWordsCoordinates[word].y = y;
      } else {
        // move x and y by a small amount in the direction of the word
        switch (poemWordsCoordinates[word].dir) {
          case direction.UP:
            y = poemWordsCoordinates[word].y - 1;
            x = poemWordsCoordinates[word].x;
            break;
          case direction.DOWN:
            y = poemWordsCoordinates[word].y + 1;
            x = poemWordsCoordinates[word].x;
            break;
          case direction.LEFT:
            x = poemWordsCoordinates[word].x - 1;
            y = poemWordsCoordinates[word].y;
            break;
          case direction.RIGHT:
            x = poemWordsCoordinates[word].x + 1;
            y = poemWordsCoordinates[word].y;
            break;
        }
        poemWordsCoordinates[word].x = x;
        poemWordsCoordinates[word].y = y;
      }
      // setPoemWordsCoordinates((prev) => ({ ...prev, [word]: { x, y, dir: poemWordsCoordinates[word].dir } }));
      context.font = "20px Arial";
      context.filter = "blur(200px)";

      /*
      context.fillStyle = `rgba(${Math.sin(frameCount * 0.1) * 128 + 128}, ${
        Math.sin(frameCount * 0.1 + 2) * 128 + 128
      }, ${Math.sin(frameCount * 0.1 + 4) * 128 + 128}, 0.5)`;
      context.shadowColor = `rgba(${Math.sin(frameCount * 0.1) * 128 + 128}, ${
        Math.sin(frameCount * 0.1 + 2) * 128 + 128
      }, ${Math.sin(frameCount * 0.1 + 4) * 128 + 128}, 0.5)`;
      context.shadowBlur = 20;
      */

      /*
      // create a gradient for the text
      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "red");
      gradient.addColorStop(0.5, "black");
      gradient.addColorStop(1, "red");

      // set the fill style to the gradient
      context.fillStyle = gradient;

      // add a shadow to the text
      context.shadowColor = "red";
      context.shadowBlur = 20;
      context.shadowOffsetX = 5;
      context.shadowOffsetY = 5;

      */

      // the words should be white with an opacity of 0.5
      context.fillStyle = "rgba(255, 255, 255, 0.2)";
      context.shadowColor = "white";
      context.shadowBlur = 20 * Math.sin(frameCount * 1000);
      context.shadowOffsetX = 5 * Math.sin(frameCount * 0.01);
      context.shadowOffsetY = 5 * Math.cos(frameCount * 0.01);

      context.fillText(word, x, y);
    });
  };

  // create the board when the component mounts
  useEffect(() => {
    createBoard();
    createPoemWords();
  }, []);

  useEffect(() => {
    let frameCount: number = 0;
    let animationFrameId: number;

    // Check if null context has been replaced on component mount
    if (context) {
      //Our draw came here
      const render = () => {
        frameCount++;
        drawPoemWordsFlashing(frameCount);
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawPoemWordsFlashing, context]);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
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
      {showPoemModal && <PoemModal setShowPoemModal={setShowPoemModal} />}
      <div className="symbols">
        {Object.keys(symbolDataMaps).map((key) => {
          return (
            <div
              key={key}
              className={`symbol ${
                symbolDataMaps[key].discovered ? "discovered" : ""
              }`}
            >
              <p>
                {symbolDataMaps[key].discovered
                  ? symbolDataMaps[key].symbol
                  : "?"}
              </p>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setShowPoemModal(true);
        }}
      >
        Show Poem
      </button>
      <div className="scoreBoard">
        <h1>Score: {score}</h1>
      </div>
      <div className="game">
        {board.map((color: string, index: number) => {
          return (
            // <img
            //   key={index}
            //   className="tile"
            //   data-id={index}
            //   draggable="true"
            //   style={{ backgroundColor: color }}
            //   onDragOver={(e) => e.preventDefault()}
            //   onDragEnter={dragEnter}
            //   onDragLeave={dragLeave}
            //   onDragStart={dragStart}
            //   onDrop={dragDrop}
            //   onDragEnd={dragEnd}
            // />
            <Tile
              key={index}
              dragEnter={dragEnter}
              dragLeave={dragLeave}
              dragStart={dragStart}
              dragDrop={dragDrop}
              dragEnd={dragEnd}
              index={index}
              color={color}
            />
          );
        })}
      </div>
      <div className="floatingWordsContainer">
        {/* a canvas element that covers the entire screen */}
        <canvas
          ref={canvasRef}
          id="floatingWords"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
            pointerEvents: "none",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default App;
