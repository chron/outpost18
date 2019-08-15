import React from 'react';
import GameContext from '../GameContext';

// TODO!
function GameProvider({ value, children }) {
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;
