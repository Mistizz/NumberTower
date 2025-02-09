export type Block = {
  value: number;
  id: string;
};

export type GridCell = Block | null;

export type Grid = GridCell[][];

export type GameState = {
  grid: Grid;
  score: number;
  currentBlock: Block | null;
  gameOver: boolean;
};

export type Score = {
  id: string;
  username: string;
  score: number;
  created_at: string;
}; 