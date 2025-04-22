import React from 'react';
import { useParams } from 'react-router-dom';


const MatchSimulation = () => {
  const { match_id } = useParams();

  return (
    <div>
      <h1>Simulación del partido</h1>
      <p>ID del partido: {match_id}</p>
    </div>
  );
};

export default MatchSimulation;
