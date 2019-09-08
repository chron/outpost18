import React from 'react';
import { useGameState } from '../GameProvider';
import KeyMap from '../KeyMap';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import GameOver from '../GameOver';
import Hint from '../Hint';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';
import EndTurnButton from '../EndTurnButton';
import Lane from '../Lane';
import DiscardPile from '../DiscardPile';

import './Game.scss';
import GameLog from '../GameLog/GameLog';

const Game = () => {
  const { player, opponent, gameState, dispatch, deckSize } = useGameState();

  const upgrades = player.inPlay.filter(s => s.mode === 'upgrade');
  const ships = player.inPlay.filter(s => s.mode === 'ship');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  // TODO: reintroduce the domRef / focus stuff for keybinds

  return (
    <KeyMap dispatch={dispatch}>
      <div className="game" tabIndex={-1}>
        <Hint />
        <GameLog />
        {gameState === 'finished' && <GameOver />}
        <div className="lanes">
          <div />

          <Lane>
            {enemyUpgrades.map(({ cardName }) => (
              <Upgrade
                key={cardName}
                owner={opponent}
                cardName={cardName}
              />
            ))}
            <Base owner={opponent} />
          </Lane>

          <div className="deck">
            <FaceDownCard count={deckSize} />
          </div>

          <Lane type="ship">
            {enemyShips.map(({ cardName, canAttack, attacking }) => (
              <Ship
                key={cardName}
                cardName={cardName}
                canAttack={canAttack}
                attacking={attacking}
              />
            ))}
          </Lane>

          <DiscardPile />

          <Lane friendly type="ship">
            {ships.map(({ cardName, canAttack, attacking }) => (
              <Ship
                key={cardName}
                friendly
                cardName={cardName}
                canAttack={canAttack}
                attacking={attacking}
              />
            ))}
          </Lane>

          <div />

          <Lane friendly type="upgrade">
            {upgrades.map(({ cardName }) => (
              <Upgrade
                key={cardName}
                friendly
                owner={player}
                cardName={cardName}
              />
            ))}
            <Base friendly cardName="Station Core" owner={player} />
          </Lane>

          <div />

          <Lane friendly type="hand">
            {player.hand.map(c => (
              <Card inHand key={c} cardName={c} />
            ))}
          </Lane>
        </div>

        <PlayerStats player={opponent} position="top" />
        <PlayerStats player={player}>
          <EndTurnButton />
        </PlayerStats>
      </div>
    </KeyMap>
  );
};

export default Game;
