import React, { useState, useContext } from 'react';
import { useApi, useAuth } from '../hooks';
import allCards from '../cards';
import Waiting from './Waiting';

const GameContext = React.createContext();

function GameProvider({ gameState,
  rematch,
  updateGameState,
  playerId,
  readonly,
  children,
  gameStateReducer,
}) {
  const { gameId, player, opponent, ruleset } = gameState;
  const { authToken } = useAuth();
  const { gameAction } = useApi();

  const [uiMode, setUiMode] = useState(null);
  const [zoomedCard, setZoomedCard] = useState(null);

  const toggleZoom = (cardName) => {
    if (zoomedCard === cardName) {
      setZoomedCard(null);
    } else {
      setZoomedCard(cardName);
    }
  };

  const submitChoice = (selected) => {
    if (!uiMode || !uiMode.mode === 'choice') {
      throw new Error('Submitting with no choice set up');
    }

    const { choices, choiceIndex, callback, lockedIn } = uiMode;

    // Gotcha: right now if you select NULL for any choice it will NULL them all
    // That works for the current cards that exist but might need rethinking later.
    // This is done through the UI via the "skip" button.
    if (selected === null) {
      callback([]);
      setChoice(null);
      return;
    }

    const newLockedIn = lockedIn.slice();
    newLockedIn.splice(choiceIndex, 1, selected);

    if (choiceIndex + 1 >= choices.length) {
      // We've made all choices, lock them in
      callback(newLockedIn);
      setChoice(null);
    } else {
      setChoice({ callback, choices, choiceIndex: choiceIndex + 1, lockedIn: newLockedIn });
    }
  };

  const setChoice = (choiceDefinition) => {
    if (choiceDefinition === null) {
      setUiMode(null);
      return;
    }

    const { callback, choices, choiceIndex = 0, lockedIn = [] } = choiceDefinition;

    const choiceArray = Array.isArray(choices)
      ? choices
      : [choices];

    // TODO: Future refactor - remove the index and just pop things off the choices array as we go
    const { type, ...choiceParams } = choiceArray[choiceIndex];
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
      submitChoice(null);
    } else {
      setUiMode({
        mode: 'choice',
        type,
        ...choiceParams,
        selected: [],
        lockedIn,
        callback,
        choiceIndex,
        choices: choiceArray,
      });
    }
  };

  const toggleSelection = (choice) => {
    // Special case if we are only picking one thing.
    // In that case instantly commit the choice instead of waiting for a manual submission.
    if (!uiMode.max) {
      submitChoice(choice);
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
    // If a reducer is provided, use that (e.g for the tutorial or local play)
    // Otherwise use the API call so the server plays the role of reducer here.
    if (gameStateReducer) {
      gameStateReducer(playerId, gameId, action);
    } else {
      gameAction(playerId, gameId, action, authToken)
        .then(updateGameState)
        .catch(e => e); // TODO: silently ignoring dup requests, but we need to handle actual errors
    }
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
    submitChoice,
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
