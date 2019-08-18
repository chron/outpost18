import React, { useState, useRef } from 'react';
import GameProvider from '../GameProvider';
import KeyMap from '../KeyMap';
import { gameAction } from '../../apiClient';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import Alert from '../Alert';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';
import Lane from '../Lane';

import './Game.scss';

const Game = ({ initialGameState, gameId, playerId, cards }) => {
  const [gameState, setGameState] = useState(initialGameState);
  const dispatch = (action) => {
    console.log(playerId, action);
    gameAction(playerId, gameId, action).then(newState => setGameState(newState));
  }

  const domRef = useRef(null);
  const currentPlayer = gameState.players.find(p => p.playerId === playerId);
  const opponent = gameState.players.find(p => p.playerId !== playerId);

  const gameStateValue = {
    ...gameState,
    cards,
    // Possible gotcha: the KeyMap below receives the original dispatch function NOT this one
    dispatch: e => { dispatch(e); domRef.current.focus(); },
    currentPlayer,
    opponent,
  };

  const upgrades = currentPlayer.inPlay.filter(s => s.mode === 'upgrade');
  const ships = currentPlayer.inPlay.filter(s => s.mode === 'ship');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  let alert;

  if (gameState.gameState === 'finished') {
    if (gameState.activePlayer === playerId) {
      alert = 'You win! Congratulations.';
    } else {
      alert = 'The game is over. You lost.';
    }
  }

  return (
    <GameProvider value={gameStateValue}>
      <KeyMap dispatch={dispatch}>
        <div className="game" ref={domRef} tabIndex={-1}>
          {alert && <Alert message={alert} />}
          <div className="lanes">
            <Lane owner={opponent} type={'upgrade'}>
              {enemyUpgrades.map(({ cardName }) => {
                return <Upgrade
                  key={cardName}
                  owner={opponent}
                  cardName={cardName}
                />
              })}
              <Base cardName="Station Core" owner={opponent} />
              <PlayerStats player={opponent} position="top" />
            </Lane>
            <Lane owner={opponent} type={'ship'}>
              <div className="fleet">
                {enemyShips.map(({ cardName, canAttack, attacking }) => {
                  return <Ship
                    key={cardName}
                    owner={opponent}
                    cardName={cardName}
                    canAttack={canAttack}
                    attacking={attacking}
                  />
                })}
              </div>

              <div className="deck deck--discard">
                <FaceDownCard count={gameState.discards.length} />
              </div>
            </Lane>
            <Lane owner={currentPlayer} type={'ship'}>
              <div className="fleet">
                {ships.map(({ cardName, canAttack, attacking }) => {
                  return <Ship
                    key={cardName}
                    owner={currentPlayer}
                    cardName={cardName}
                    canAttack={canAttack}
                    attacking={attacking}
                  />
                })}
              </div>

              <div className="deck">
                <FaceDownCard count={gameState.deck.length} />
              </div>
            </Lane>
            <Lane owner={currentPlayer} type={'upgrade'}>
              {upgrades.map(({ cardName }) => {
                return <Upgrade
                  key={cardName}
                  owner={currentPlayer}
                  cardName={cardName}
                />
              })}
              <Base cardName="Station Core" owner={currentPlayer} />
            </Lane>
            <Lane owner={currentPlayer} type={'hand'}>
              {currentPlayer.hand.map(c => <Card key={c} cardName={c} />)}
            </Lane>
          </div>
          <PlayerStats player={currentPlayer} />
        </div>
      </KeyMap>
    </GameProvider>
  );
};

export default Game;
