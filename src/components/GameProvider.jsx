import React, { useState, useContext } from 'react';
import { gameAction } from '../lib/apiClient';
import allCards from '../cards';
import Waiting from './Waiting';

const GameContext = React.createContext();

function GameProvider({ gameState, rematch, updateGameState, playerId, readonly, children }) {
  const { gameId, player, opponent, ruleset } = gameState;

  const [uiMode, setUiMode] = useState(null);
  const [zoomedCard, setZoomedCard] = useState(null);

  const toggleZoom = (cardName) => {
    if (zoomedCard === cardName) {
      setZoomedCard(null);
    } else {
      setZoomedCard(cardName);
    }
  };

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

  const toggleSelection = (choice) => {
    // Special case if we are only picking one thing.
    // In that case instantly commit the choice instead of toggling selection.
    if (!uiMode.max) {
      uiMode.callback(choice);
      setChoice(null);
      return;
    }

    let selected = uiMode.selected.slice();
    const choiceIndex = selected.indexOf(choice);

    if (choiceIndex >= 0) {
      selected.splice(choiceIndex, 1);
    } else {
      selected = selected.concat(choice);
    }

    setUiMode({ ...uiMode, selected });
  };

  const dispatch = (action) => {
    gameAction(playerId, gameId, action).then(updateGameState);
  };

  const resignAndQuit = () => {
    if (gameState.gameState !== 'finished') {
      dispatch({ type: 'resign' });
    }

    updateGameState({});
  };

  const cards = allCards[ruleset];

  if (!cards) { throw new Error(`Could not find card data for ruleset: ${ruleset}`); }

  const gameStateValue = {
    ...gameState,
    readonly,
    cards,
    dispatch,
    uiMode,
    setChoice,
    toggleSelection,
    resignAndQuit,
    rematch,
    zoomedCard,
    toggleZoom,
    soloGame: opponent && opponent.aiController,
    gameInProgress: gameState.gameState === 'main' || gameState.gameState === 'begin',
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
