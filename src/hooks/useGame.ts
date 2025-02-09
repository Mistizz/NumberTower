import { useState, useCallback, useEffect } from 'react';
import { Block, Grid, GameState } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

const GRID_ROWS = 8;
const GRID_COLS = 6;

const createEmptyGrid = (): Grid => {
  return Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: createEmptyGrid(),
    score: 0,
    currentBlock: null,
    gameOver: false
  });

  const getMaxBlockValue = useCallback((grid: Grid): number => {
    let max = 1;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const block = grid[row][col];
        if (block && block.value > max) {
          max = block.value;
        }
      }
    }
    return max;
  }, []);

  const generateNewBlock = useCallback((grid: Grid): Block => {
    const maxValue = getMaxBlockValue(grid);
    return {
      value: Math.floor(Math.random() * maxValue) + 1,
      id: uuidv4()
    };
  }, [getMaxBlockValue]);

  // 重力処理を行う関数
  const applyGravity = useCallback((grid: Grid): Grid => {
    const newGrid = grid.map(row => [...row]);
    
    // 各列について処理
    for (let col = 0; col < GRID_COLS; col++) {
      // 下から上に向かって処理
      for (let row = GRID_ROWS - 1; row > 0; row--) {
        // 現在のセルが空の場合
        if (!newGrid[row][col]) {
          // 上のブロックを探す
          for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
            if (newGrid[aboveRow][col]) {
              // 上のブロックを見つけたら落下させる
              newGrid[row][col] = newGrid[aboveRow][col];
              newGrid[aboveRow][col] = null;
              break;
            }
          }
        }
      }
    }
    
    return newGrid;
  }, []);

  // 指定位置の周囲にある同じ値のブロックを全て見つける
  const findAllMergingBlocks = useCallback((grid: Grid, row: number, col: number): { row: number; col: number; }[] => {
    const currentBlock = grid[row][col];
    if (!currentBlock) return [];

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const mergingBlocks: { row: number; col: number; }[] = [];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (
        newRow >= 0 && newRow < GRID_ROWS &&
        newCol >= 0 && newCol < GRID_COLS &&
        grid[newRow][newCol]?.value === currentBlock.value
      ) {
        mergingBlocks.push({ row: newRow, col: newCol });
      }
    });

    return mergingBlocks;
  }, []);

  const performMerge = useCallback((grid: Grid, position: { row: number; col: number }): { grid: Grid, points: number, merged: boolean } => {
    const { row, col } = position;
    const currentBlock = grid[row][col];
    if (!currentBlock) return { grid, points: 0, merged: false };

    const mergingBlocks = findAllMergingBlocks(grid, row, col);
    if (mergingBlocks.length === 0) return { grid, points: 0, merged: false };

    const newGrid = grid.map(row => [...row]);
    const points = currentBlock.value * (mergingBlocks.length + 1);

    // マージするブロックを消去
    mergingBlocks.forEach(({ row, col }) => {
      newGrid[row][col] = null;
    });

    // 新しい値のブロックを作成（現在の位置に生成）
    newGrid[row][col] = {
      value: currentBlock.value + 1,
      id: uuidv4()
    };

    return { grid: newGrid, points, merged: true };
  }, [findAllMergingBlocks]);

  const checkAllMerges = useCallback((grid: Grid, position: { row: number; col: number }): { newGrid: Grid, points: number } => {
    let currentGrid = grid;
    let totalPoints = 0;
    let currentPosition = position;
    let mergeFound;

    do {
      // まず現在の位置でマージをチェック
      const result = performMerge(currentGrid, currentPosition);
      if (result.merged) {
        currentGrid = result.grid;
        totalPoints += result.points;
        currentGrid = applyGravity(currentGrid);
        // 同じ位置で再度チェック（連鎖マージのため）
        mergeFound = true;
        continue;
      }

      // 現在の位置で新しいマージが見つからない場合、
      // 周囲のブロックから優先的にマージ可能なものを探す
      mergeFound = false;
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dx, dy] of directions) {
        const newRow = currentPosition.row + dx;
        const newCol = currentPosition.col + dy;
        
        if (
          newRow >= 0 && newRow < GRID_ROWS &&
          newCol >= 0 && newCol < GRID_COLS &&
          currentGrid[newRow][newCol]
        ) {
          const mergingBlocks = findAllMergingBlocks(currentGrid, newRow, newCol);
          if (mergingBlocks.length > 0) {
            currentPosition = { row: newRow, col: newCol };
            mergeFound = true;
            break;
          }
        }
      }

      // 周囲にマージ可能なブロックがない場合、
      // 最後にマージが発生した位置の周辺から順にグリッド全体をスキャン
      if (!mergeFound) {
        const visited = new Set<string>();
        const queue: { row: number; col: number; }[] = [currentPosition];
        
        while (queue.length > 0 && !mergeFound) {
          const pos = queue.shift()!;
          const key = `${pos.row},${pos.col}`;
          
          if (visited.has(key)) continue;
          visited.add(key);

          // 現在位置のブロックをチェック
          if (currentGrid[pos.row][pos.col]) {
            const mergingBlocks = findAllMergingBlocks(currentGrid, pos.row, pos.col);
            if (mergingBlocks.length > 0) {
              currentPosition = pos;
              mergeFound = true;
              break;
            }
          }

          // 隣接セルをキューに追加
          for (const [dx, dy] of directions) {
            const newRow = pos.row + dx;
            const newCol = pos.col + dy;
            
            if (
              newRow >= 0 && newRow < GRID_ROWS &&
              newCol >= 0 && newCol < GRID_COLS
            ) {
              queue.push({ row: newRow, col: newCol });
            }
          }
        }
      }
    } while (mergeFound);

    return { newGrid: currentGrid, points: totalPoints };
  }, [performMerge, applyGravity, findAllMergingBlocks]);

  const dropBlock = useCallback((column: number) => {
    if (gameState.gameOver || !gameState.currentBlock) return;

    setGameState(prev => {
      const newGrid = prev.grid.map(row => [...row]);
      let row = 0;

      // 落下位置を見つける
      while (row < GRID_ROWS - 1 && !newGrid[row + 1][column]) {
        row++;
      }

      if (row === 0 && newGrid[row][column]) {
        return { ...prev, gameOver: true };
      }

      // ブロックを配置
      newGrid[row][column] = prev.currentBlock;
      
      // 現在の位置でマージをチェック
      const position = { row, col: column };
      const { newGrid: mergedGrid, points } = checkAllMerges(newGrid, position);

      return {
        grid: mergedGrid,
        score: prev.score + points,
        currentBlock: generateNewBlock(mergedGrid),
        gameOver: false
      };
    });
  }, [gameState.gameOver, gameState.currentBlock, generateNewBlock, checkAllMerges]);

  // 初期ブロックの生成
  useEffect(() => {
    if (!gameState.currentBlock) {
      setGameState(prev => ({
        ...prev,
        currentBlock: generateNewBlock(prev.grid)
      }));
    }
  }, [gameState.currentBlock, generateNewBlock]);

  return {
    gameState,
    dropBlock
  };
}; 