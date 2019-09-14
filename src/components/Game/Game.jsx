import React, { useState } from 'react';
import { useGameState } from '../GameProvider';
import KeyMap from '../KeyMap';
import Base from '../Base';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import Ship from '../Ship';
import GameOver from '../GameOver';
import Hint from '../Hint';
import Alert from '../Alert';
import Upgrade from '../Upgrade';
import PlayerStats from '../PlayerStats';
import EndTurnButton from '../EndTurnButton';
import Lane from '../Lane';
import DiscardPile from '../DiscardPile';

import './Game.scss';
import GameLog from '../GameLog/GameLog';

const Game = () => {
  const { player, opponent, myTurn, gameState, dispatch, deckSize } = useGameState();
  const [showGameLog, setShowGameLog] = useState(false);

  const upgrades = player.inPlay.filter(s => s.mode === 'upgrade');
  const ships = player.inPlay.filter(s => s.mode === 'ship');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  // TODO: reintroduce the domRef / focus stuff for keybinds

  const keyHandlers = {
    TOGGLE_GAME_LOG: () => setShowGameLog(current => !current),
  };

  return (
    <KeyMap dispatch={dispatch} handlers={keyHandlers}>
      <div className="game" tabIndex={-1}>
        <Hint />
        {showGameLog ? <GameLog /> : null}
        {gameState === 'finished' ? <GameOver /> : null}
        {myTurn ? <Alert>Your turn.</Alert> : null}
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
                owner={player}
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
                owner={player}
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

        <PlayerStats player={opponent} />
        <PlayerStats friendly player={player}>
          <EndTurnButton />
        </PlayerStats>
      </div>
    </KeyMap>
  );
};

export default Game;
