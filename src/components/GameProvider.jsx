import React, { useState, useContext, useEffect } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../lib/apiClient';
import cards from '../logic/cards';
import Waiting from './Waiting';

const GameContext = React.createContext();

function GameProvider({ initialGameState, setStoredGameId, playerId, quitGame, children }) {
  const { gameId } = initialGameState;

  const [gameState, setGameState] = useState(initialGameState);
  const [uiMode, setUiMode] = useState(null);

  // TODO: not sure if this is necessary now?
  const updateStateIfNewer = (newState) => {
    if (newState.tick > gameState.tick) { setGameState(newState); }
  };

  const setChoice = (choice) => {
    if (choice === null) {
      setUiMode(null);
      return;
    }

    const { type, callback, ...choiceArgs } = choice;

    let validTargets = [];
    const player = gameState.players.find(p => p.playerId === playerId);
    const opponent = gameState.players.find(p => p.playerId !== playerId);

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

  useWebsocket(playerId, gameId, updateStateIfNewer);

  // When the game ends, clear the saved gameId out.
  // That means on page refresh you'll get the welcome screen again.
  useEffect(() => {
    if (gameState.gameState === 'finished' || gameState.gameState === 'abandoned') {
      setStoredGameId(null);
    }
  }, [gameState.gameState, setStoredGameId]);

  const dispatch = (action) => {
    gameAction(playerId, gameId, action).then(updateStateIfNewer);
  };

  const resignAndQuit = () => {
    dispatch({ type: 'resign' });
    quitGame();
  }

  const gameStateValue = {
    ...gameState,
    cards,
    dispatch,
    uiMode,
    setChoice,
    toggleSelection,
    resignAndQuit,
    currentPlayer: gameState.players.find(p => p.playerId === playerId),
    opponent: gameState.players.find(p => p.playerId !== playerId),
    myTurn: playerId === gameState.activePlayer,
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
