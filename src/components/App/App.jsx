import React, { useState, useEffect } from 'react';
import Normalize from 'react-normalize';
import Game from '../Game';
import cards from '../../cards';
import './App.scss';

function App() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    fetch('/.netlify/functions/create-game', {
      method: 'POST',
      body: JSON.stringify({ test: 'yeet' }),
    }).then(response => response.json())
      .then(data => setGameState({ ...data, cards }));
  }, []);

  return (
    <React.Fragment>
      <Normalize />

      {gameState && <Game initialGameState={gameState} playerName="me"/>}
    </React.Fragment>
  );
}

export default App;
