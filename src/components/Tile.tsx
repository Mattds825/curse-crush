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
  return (
    <div
      className="tile"
      style={{ backgroundColor: color }}
      data-id={index}
      draggable="true"
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDragStart={dragStart}
      onDrop={dragDrop}
      onDragEnd={dragEnd}
    ></div>
  );
};

export default Tile;
