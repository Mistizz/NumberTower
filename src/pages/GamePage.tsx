import styled from 'styled-components';
import { useGame } from '../hooks/useGame';
import { GameGrid } from '../components/GameGrid';
import { NextBlock } from '../components/NextBlock';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { GameOverModal } from '../components/GameOverModal';
import { supabase } from '../lib/supabase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 100vh;
  background-color: #ecf0f1;
`;

const GameContainer = styled.div`
  display: flex;
  gap: 60px;
  align-items: center;
  margin-bottom: 40px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const GamePage = () => {
  const { gameState, dropBlock } = useGame();

  const handleSaveScore = async (username: string) => {
    try {
      await supabase.from('scores').insert([
        {
          username,
          score: gameState.score,
        },
      ]);
      // スコア保存後にページをリロードしてゲームをリセット
      window.location.reload();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  return (
    <Container>
      <GameContainer>
        <GameGrid
          grid={gameState.grid}
          onColumnClick={dropBlock}
        />
        <SidePanel>
          <NextBlock block={gameState.currentBlock} />
          <ScoreDisplay score={gameState.score} />
        </SidePanel>
      </GameContainer>

      {gameState.gameOver && (
        <GameOverModal
          score={gameState.score}
          onSaveScore={handleSaveScore}
        />
      )}
    </Container>
  );
}; 