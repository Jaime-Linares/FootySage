import React from 'react';
import { useParams } from 'react-router-dom';


const MatchAnalysis = () => {
  const { league, match_id } = useParams();

  return (
    <div>
      <h1>Match Analysis</h1>
      <p>League: {league}</p>
      <p>ID del partido: {match_id}</p>
    </div>
  );
};


export default MatchAnalysis;
