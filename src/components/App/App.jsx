import React from 'react';
import Normalize from 'react-normalize';
import shuffle from 'lodash.shuffle';
import Game from '../Game';
import cards from '../../cards';
import './App.scss';

const DEBUG_MODE = true;

function App() {
  // TODO: make this an actual card instead of this weird inline thing
  const baseStats = { name: 'Station Core', mode: 'base', shields: 5, draws: 1 };
  const deck = shuffle(cards.map(c => c.name));

  const fakeState = {
    gameState: 'main',
    activePlayer: 'me',
    cards,
    deck,
    discards: [],
    players: ['me', 'opponent'].map(name => {
      return {
        name,
        plays: DEBUG_MODE ? 100 : 1,
        attackPool: 0,
        hand: deck.splice(0, DEBUG_MODE ? 5 : 3),
        inPlay: [{ ...baseStats }],
      }
    }),
  };

  return (
    <React.Fragment>
      <Normalize />
      <Game initialGameState={fakeState} playerName="me"/>
    </React.Fragment>
  );
}

export default App;
