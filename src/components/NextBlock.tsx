import styled from 'styled-components';
import { Block } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const BlockPreview = styled.div`
  width: 40px;
  height: 40px;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: bold;
  color: white;
`;

interface NextBlockProps {
  block: Block | null;
}

export const NextBlock: React.FC<NextBlockProps> = ({ block }) => {
  return (
    <Container>
      <Label>Next Block</Label>
      <BlockPreview>
        {block?.value || ''}
      </BlockPreview>
    </Container>
  );
}; 