import styled from 'styled-components';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
`;

const Title = styled.h2`
  color: #e74c3c;
  margin-bottom: 20px;
`;

const Score = styled.p`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 200px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${props => props.variant === 'secondary' ? '#95a5a6' : '#3498db'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#7f8c8d' : '#2980b9'};
  }
`;

interface GameOverModalProps {
  score: number;
  onSaveScore: (username: string) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onSaveScore }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      onSaveScore(username.trim());
    }
  };

  const handleClose = () => {
    window.location.reload();
  };

  return (
    <Overlay>
      <Modal>
        <Title>Game Over!</Title>
        <Score>Final Score: {score}</Score>
        <Input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <ButtonContainer>
          <Button variant="primary" onClick={handleSubmit}>Save Score</Button>
          <Button variant="secondary" onClick={handleClose}>New Game</Button>
        </ButtonContainer>
      </Modal>
    </Overlay>
  );
}; 