import React, { useReducer } from 'react';
import GameContext from '../../GameContext';
import reducer from '../../reducer.js';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';

import './Game.scss';

const Game = ({ initialGameState, playerName }) => {
  const [gameState, dispatch] = useReducer(reducer, initialGameState);
  const currentPlayer = gameState.players.find(p => p.name === playerName);
  const opponent = gameState.players.find(p => p.name !== playerName);

  const gameStateValue = {
    ...gameState,
    dispatch,
    currentPlayer,
    opponent,
  };

  const base = currentPlayer.inPlay.find(s => s.mode === 'base');
  const upgrades = currentPlayer.inPlay.filter(s => s.mode === 'upgrade');
  const ships = currentPlayer.inPlay.filter(s => s.mode === 'ship');
  const enemyBase = opponent.inPlay.find(s => s.mode === 'base');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  return (
    <GameContext.Provider value={gameStateValue}>
      <div className="game">
        <div className="lanes">
          <div className="lane">
            {Array(opponent.hand.length).fill(1).map((_, i) => <FaceDownCard key={i} />)}

            <PlayerStats playerName={opponent.name} position="top"/>
          </div>
          <div className="lane">
            {enemyUpgrades.map(({ cardName }) => {
              return <Upgrade
                key={cardName}
                playerName={opponent.name}
                cardName={cardName}
              />
            })}
            <Base stats={enemyBase} />
          </div>
          <div className="lane">
            <div className="fleet">
              {enemyShips.map(({ cardName, canAttack, attacking }) => {
                return <Ship
                  key={cardName}
                  playerName={opponent.name}
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
                  playerName={currentPlayer.name}
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
                playerName={currentPlayer.name}
                cardName={cardName}
              />
            })}
            <Base stats={base} />
          </div>
          <div className="lane">
            {currentPlayer.hand.map(c => <Card key={c} playerName={currentPlayer.name} cardName={c} />)}
          </div>
        </div>
        <PlayerStats playerName={currentPlayer.name} />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
