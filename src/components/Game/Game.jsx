import React from 'react';
import { useGameState } from '../GameProvider';
import KeyMap from '../KeyMap';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import Alert from '../Alert';
import Hint from '../Hint';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';
import Lane from '../Lane';
import DiscardPile from '../DiscardPile';

import './Game.scss';

const Game = () => {
  const { currentPlayer, opponent, myTurn, gameState, dispatch, deckSize } = useGameState();

  const upgrades = currentPlayer.inPlay.filter(s => s.mode === 'upgrade');
  const ships = currentPlayer.inPlay.filter(s => s.mode === 'ship');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  let alert;

  if (gameState === 'finished') {
    if (myTurn) { // TODO: activePlayer = winner is kind of unintuitive
      alert = 'You win! Congratulations.';
    } else {
      alert = 'The game is over. You lost.';
    }
  }

  // TODO: reintroduce the domRef / focus stuff for keybinds

  return (
    <KeyMap dispatch={dispatch}>
      <div className="game" tabIndex={-1}>
        <Hint />
        {alert && <Alert>{alert}</Alert>}
        <div className="lanes">
          <Lane owner={opponent} type="upgrade">
            {enemyUpgrades.map(({ cardName }) => (
              <Upgrade
                key={cardName}
                owner={opponent}
                cardName={cardName}
              />
            ))}
            <Base cardName="Station Core" owner={opponent} />
            <PlayerStats player={opponent} position="top" />
          </Lane>
          <Lane owner={opponent} type="ship">
            <div className="fleet">
              {enemyShips.map(({ cardName, canAttack, attacking }) => (
                <Ship
                  key={cardName}
                  owner={opponent}
                  cardName={cardName}
                  canAttack={canAttack}
                  attacking={attacking}
                />
              ))}
            </div>

            <DiscardPile />
          </Lane>
          <Lane owner={currentPlayer} type="ship">
            <div className="fleet">
              {ships.map(({ cardName, canAttack, attacking }) => (
                <Ship
                  key={cardName}
                  owner={currentPlayer}
                  cardName={cardName}
                  canAttack={canAttack}
                  attacking={attacking}
                />
              ))}
            </div>

            <div className="deck">
              <FaceDownCard count={deckSize} />
            </div>
          </Lane>
          <Lane owner={currentPlayer} type="upgrade">
            {upgrades.map(({ cardName }) => (
              <Upgrade
                key={cardName}
                owner={currentPlayer}
                cardName={cardName}
              />
            ))}
            <Base cardName="Station Core" owner={currentPlayer} />
          </Lane>
          <Lane owner={currentPlayer} type="hand">
            {currentPlayer.hand.map(c => <Card inHand key={c} cardName={c} />)}
          </Lane>
        </div>
        <PlayerStats player={currentPlayer} />
      </div>
    </KeyMap>
  );
};

export default Game;
