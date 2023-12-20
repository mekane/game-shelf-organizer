import { Shelf } from "../../types";

const CubeDisplay = ({ id }: { id: string }) => {
  return (
    <div
      style={{
        alignSelf: "center" /* end; */,
        background: "#333",
        height: "100%",
        width: "100%",
      }}
    >
      {id}
    </div>
  );
};

export interface ShelfDisplayProps {
  shelf: Shelf;
}

export const ShelfDisplay = ({ shelf }: ShelfDisplayProps) => {
  const numberOfRows = shelf.rows ?? 1;
  const numberOfColumns = shelf.columns ?? 1;

  const rows = [];
  for (let r = 0; r < numberOfRows; r++) {
    for (let c = 0; c < numberOfColumns; c++) {
      const cubeId = `${shelf.id}.${r}.${c}`;
      rows.push(<CubeDisplay key={cubeId} id={cubeId} />);
    }
  }

  const width = shelf.width ?? 12 * numberOfColumns; // default one foot per row
  const height = shelf.height ?? 12 * numberOfRows; // default one foot per column

  const borderColor = "#666";
  const outerBorderThickness = "8px";
  const interBorderThickness = "5px";

  const shelfStyles = {
    border: `${outerBorderThickness} solid ${borderColor}`,
    backgroundColor: borderColor,
    display: "grid",
    width: `${width}em`,
    height: `${height}em`,
    gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
    gridTemplateRows: `repeat(${numberOfRows}, 1fr)`,
    gap: interBorderThickness,
  };

  return (
    <div className="shelf" style={shelfStyles}>
      {rows}
    </div>
  );
};
