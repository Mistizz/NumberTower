import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const Score = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
`;

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <Container>
      <Label>Score</Label>
      <Score>{score}</Score>
    </Container>
  );
}; 