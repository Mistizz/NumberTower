import styled from 'styled-components';
import { Grid, Block } from '../types/game';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 60px);
  gap: 4px;
  background-color: #2c3e50;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: fit-content;
  margin: 0 auto;
`;

const Cell = styled.div<{ isActive: boolean; value: number }>`
  width: 60px;
  height: 60px;
  background-color: ${props => props.isActive 
    ? `hsl(${props.value * 30}, 70%, 50%)`
    : '#34495e'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 24px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: ${props => !props.isActive && 'translateY(-2px)'};
    background-color: ${props => props.isActive 
      ? `hsl(${props.value * 30}, 70%, 45%)`
      : '#2c3e50'};
  }
`;

const ColumnHighlight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
  transition: transform 0.2s ease;
`;

interface GameGridProps {
  grid: Grid;
  currentBlock: Block | null;
  onColumnClick: (column: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ grid, currentBlock, onColumnClick }) => {
  return (
    <GridContainer>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isActive={cell !== null}
            value={cell?.value || 0}
            onClick={() => onColumnClick(colIndex)}
          >
            {cell?.value || ''}
          </Cell>
        ))
      )}
    </GridContainer>
  );
}; 