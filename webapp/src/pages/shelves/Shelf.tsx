export interface ShelfConfig {
  name?: string;
  width?: number; //inches
  height?: number; //inches
  rows?: number;
  columns?: number;
}

export interface ShelfProps {
  config: ShelfConfig;
}

const Cube = ({ id }: { id: string }) => {
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

export const Shelf = ({ config }: ShelfProps) => {
  const numberOfRows = config.rows ?? 1;
  const numberOfColumns = config.columns ?? 1;

  const rows = [];
  for (let r = 0; r < numberOfRows; r++) {
    for (let c = 0; c < numberOfColumns; c++) {
      const boxId = `${r}.${c}`;
      rows.push(<Cube key={boxId} id={boxId} />);
    }
  }

  const width = config.width ?? 12 * numberOfColumns; // default one foot per row
  const height = config.height ?? 12 * numberOfRows; // default one foot per column

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
