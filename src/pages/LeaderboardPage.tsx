import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { Score } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
  background-color: #ecf0f1;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 40px;
`;

const Table = styled.table`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 15px;
  text-align: left;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f7f9fa;
  }
`;

const BackButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const LeaderboardPage = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);

        if (error) throw error;
        setScores(data || []);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <Container>
      <Title>Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Player</Th>
            <Th>Score</Th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <Tr key={score.id}>
              <Td>{index + 1}</Td>
              <Td>{score.username}</Td>
              <Td>{score.score}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <BackButton onClick={() => window.location.href = '/'}>
        Back to Game
      </BackButton>
    </Container>
  );
}; 