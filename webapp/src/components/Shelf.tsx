import './Shelf.css'

export interface ShelfConfig {
    name?: string;
    width?: number; //inches
    height?: number; //inches
    rows?: number;
    columns?: number;
}

export interface ShelfProps {
    config: ShelfConfig
}

export const Shelf = (props: ShelfProps) => {

    const numberOfRows = props.config.rows ?? 1;
    const numberOfColumns = props.config.columns ?? 1;

    const rows = [];
    for ( let r = 0 ; r < numberOfRows ; r++ ) {
        for ( let c = 0 ; c < numberOfColumns ; c++ ) {
            const boxId = `${r}.${c}`;
            rows.push(<div className="box" key={boxId}>{ boxId }</div> )
        }
    }

    const width = props.config.width ?? 12 * numberOfColumns; // default one foot per row
    const height = props.config.height ?? 12 * numberOfRows; // default one foot per column

    const borderColor = '#666';
    const outerBorderThickness = '8px';
    const interBorderThickness = '5px'

    const shelfStyles = {
        border: `${outerBorderThickness} solid ${borderColor}`,
        backgroundColor: borderColor,
        width: `${width}em`,
        height: `${height}em`,
        gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
        gridTemplateRows: `repeat(${numberOfRows}, 1fr)`,
        gap: interBorderThickness
    }

    return (
        <div className="shelf" style={shelfStyles}>
        { rows }
        </div>
    )
}