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
import DragLayer from '../DragLayer';
import StaticCard from '../StaticCard';
import './Game.scss';
import GameLog from '../GameLog/GameLog';

const Game = () => {
  const {
    player,
    opponent,
    myTurn,
    gameState,
    dispatch,
    deckSize,
    zoomedCard,
    toggleZoom,
  } = useGameState();
  const [showGameLog, setShowGameLog] = useState(false);

  const upgrades = player.inPlay.filter(s => s.mode === 'upgrade');
  const ships = player.inPlay.filter(s => s.mode === 'ship');
  const enemyUpgrades = opponent.inPlay.filter(s => s.mode === 'upgrade');
  const enemyShips = opponent.inPlay.filter(s => s.mode === 'ship');

  // TODO: reintroduce the domRef / focus stuff for keybinds

  const onBackgroundClick = e => {
    const classes = [...e.target.classList];

    if (classes.includes('lane') || classes.includes('fleet')) {
      toggleZoom(null);
    }
  };

  const keyHandlers = {
    TOGGLE_GAME_LOG: () => setShowGameLog(current => !current),
  };

  return (
    <KeyMap dispatch={dispatch} handlers={keyHandlers}>
      <div className="game" tabIndex={-1} onClick={onBackgroundClick}>
        <DragLayer />
        {myTurn && gameState !== 'finished' ? <Alert>Your turn.</Alert> : null}
        <Hint />
        {showGameLog ? <GameLog /> : null}
        {gameState === 'finished' ? <GameOver /> : null}
        {zoomedCard ? (
          <StaticCard
            cardName={zoomedCard}
            className="card card--zoomed"
            onClick={toggleZoom}
          />
        ) : null}
        <div className="lanes">
          <Lane>
            <button
              type="button"
              className="button end-turn end-turn--reverse"
              disabled={gameState === 'abandoned' || gameState === 'finished'}
              onClick={() => dispatch({ type: 'resign' })}
            >
              Resign<br/>
              game
            </button>

            <PlayerStats player={opponent} />

            {enemyUpgrades.map(({ cardName }) => (
              <Upgrade
                key={cardName}
                owner={opponent}
                cardName={cardName}
              />
            ))}
            <Base owner={opponent} />
          </Lane>

          <Lane type="ship">
            <div className="fleet">
              {enemyShips.map(({ cardName, canAttack, attacking, attackAdded }) => (
                <Ship
                  key={cardName}
                  owner={player}
                  cardName={cardName}
                  canAttack={canAttack}
                  attacking={attacking}
                  attackAdded={attackAdded}
                />
              ))}
            </div>

            <div className="deck">
              <FaceDownCard count={deckSize} />
            </div>
          </Lane>

          <Lane friendly type="ship">
            <DiscardPile />

            <div className="fleet">
              {ships.map(({ cardName, canAttack, attacking, attackAdded }) => (
                <Ship
                  key={cardName}
                  friendly
                  owner={player}
                  cardName={cardName}
                  canAttack={canAttack}
                  attacking={attacking}
                  attackAdded={attackAdded}
                />
              ))}
            </div>
          </Lane>

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

            <PlayerStats friendly player={player} />
            <EndTurnButton />
          </Lane>

          <Lane friendly type="hand">
            {player.hand.map(c => (
              <Card inHand key={c} cardName={c} />
            ))}
          </Lane>
        </div>
      </div>
    </KeyMap>
  );
};

export default Game;
