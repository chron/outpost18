import React from 'react';
import Normalize from 'react-normalize';
import shuffle from 'lodash.shuffle';
import Game from '../Game';
import cards from '../../cards';
import './App.scss';

function App() {
  const baseStats = { cardName: 'Station Core', mode: 'base' };
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  const fakeState = {
    gameState: 'main',
    activePlayer: 'me',
    cards,
    deck,
    discards: [],
    players: ['me', 'opponent'].map(name => {
      return {
        name,
        plays: name === 'me' ? 1 : 0,
        attackPool: 0,
        hand: deck.splice(0, name === 'me' ? 2 : 3),
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
