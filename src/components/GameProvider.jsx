import React, { useState, useContext, useEffect } from 'react';
import { gameAction } from '../lib/apiClient';
import cards from '../logic/cards';
import Waiting from './Waiting';

const GameContext = React.createContext();

function GameProvider({ gameState, setGameState, setStoredGameId, playerId, children }) {
  const { gameId, player, opponent } = gameState;

  const [uiMode, setUiMode] = useState(null);

  const setChoice = (choice) => {
    if (choice === null) {
      setUiMode(null);
      return;
    }

    const { type, callback, ...choiceArgs } = choice;

    let validTargets = [];

    if (type === 'ship') {
      validTargets = opponent.inPlay.filter(s => s.mode === 'ship').map(s => s.cardName);
    } else if (type === 'upgrade') {
      validTargets = opponent.inPlay.filter(s => s.mode === 'upgrade').map(s => s.cardName);
      validTargets = validTargets.filter(c => c !== 'Station Core');
    } else if (type === 'card') {
      validTargets = player.hand;
    }

    if (validTargets.length === 0) {
      callback();
    } else {
      setUiMode({ mode: 'choice', type, selected: [], callback, ...choiceArgs });
    }
  };

  const quitGame = () => {
    setStoredGameId(null);
    setGameState({});
  };

  const toggleSelection = (choice) => {
    let selected = uiMode.selected.slice();
    const choiceIndex = selected.indexOf(choice);

    if (choiceIndex >= 0) {
      selected.splice(choiceIndex, 1);
    } else {
      selected = selected.concat(choice);
    }

    setUiMode({ ...uiMode, selected });
  };

  // When the game ends, clear the saved gameId out.
  // That means on page refresh you'll get the welcome screen again.
  useEffect(() => {
    if (gameState.gameState === 'finished' || gameState.gameState === 'abandoned') {
      setStoredGameId(null);
    }
  }, [gameState.gameState, setStoredGameId]);

  const dispatch = (action) => {
    gameAction(playerId, gameId, action).then(setGameState);
  };

  const resignAndQuit = () => {
    dispatch({ type: 'resign' });
    quitGame();
  };

  const gameStateValue = {
    ...gameState,
    cards,
    dispatch,
    uiMode,
    setChoice,
    toggleSelection,
    resignAndQuit,
    myTurn: gameState.activePlayer === 'player',
  };

  return (
    <GameContext.Provider value={gameStateValue}>
      {gameState.gameState === 'waiting'
        ? <Waiting />
        : children
      }
    </GameContext.Provider>
  );
}

const useGameState = () => useContext(GameContext);

export { GameProvider, useGameState };
