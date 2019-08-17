import React, { useReducer, useRef } from 'react';
import GameProvider from '../GameProvider';
import KeyMap from '../KeyMap';
import reducer from '../../reducer';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import Alert from '../Alert';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';

import './Game.scss';

const Game = ({ initialGameState, playerId }) => {
  const [gameState, dispatch] = useReducer(reducer, initialGameState);
  const domRef = useRef(null);
  const currentPlayer = gameState.players.find(p => p.playerId === playerId);
  const opponent = gameState.players.find(p => p.playerId !== playerId);

  const gameStateValue = {
    ...gameState,
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
            <div className="lane">
              {Array(opponent.hand.length).fill(1).map((_, i) => <FaceDownCard key={i} />)}

              <PlayerStats player={opponent} position="top" />
            </div>
            <div className="lane">
              {enemyUpgrades.map(({ cardName }) => {
                return <Upgrade
                  key={cardName}
                  owner={opponent}
                  cardName={cardName}
                />
              })}
              <Base cardName="Station Core" owner={opponent} />
            </div>
            <div className="lane">
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
            </div>
            <div className="lane">
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
            </div>
            <div className="lane">
              {upgrades.map(({ cardName }) => {
                return <Upgrade
                  key={cardName}
                  owner={currentPlayer}
                  cardName={cardName}
                />
              })}
              <Base cardName="Station Core" owner={currentPlayer} />
            </div>
            <div className="lane">
              {currentPlayer.hand.map(c => <Card key={c} cardName={c} />)}
            </div>
          </div>
          <PlayerStats player={currentPlayer} />
        </div>
      </KeyMap>
    </GameProvider>
  );
};

export default Game;
