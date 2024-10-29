import React from "react";
import PropTypes from "prop-types";

interface TileProps {
  index: number;
  color: string;
  dragEnter: (e: React.DragEvent<HTMLImageElement>) => void;
  dragLeave: (e: React.DragEvent<HTMLImageElement>) => void;
  dragStart: (e: React.DragEvent<HTMLImageElement>) => void;
  dragDrop: (e: React.DragEvent<HTMLImageElement>) => void;
  dragEnd: (e: React.DragEvent<HTMLImageElement>) => void;
}

const Tile: React.FC<TileProps> = (props) => {
  const { index, color, dragEnter, dragLeave, dragStart, dragDrop, dragEnd } =
    props;

  const colorIconMap: { [key: string]: string } = {
    blue: "𖤐",
    green: "𓅔",
    orange: "𓃶",
    purple: "𓆣",
    red: "𓁿",
    yellow: "𓋹",
  };

  return (
    <img
      className="tile"
      data-id={index}
      draggable="true"
      style={{ backgroundColor: color }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDragStart={dragStart}
      onDrop={dragDrop}
      onDragEnd={dragEnd}
    />
  );
};

export default Tile;
