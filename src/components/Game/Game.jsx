import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navigate } from '@reach/router';
import { useGameState } from '../GameProvider';
import KeyMap from '../KeyMap';
import FaceDownCard from '../FaceDownCard';
import Card from '../Card';
import GameOver from '../GameOver';
import Hint from '../Hint';
import Alert from '../Alert';
import PlayerBase from '../PlayerBase';
import PlayerFleet from '../PlayerFleet';
import PlayerStats from '../PlayerStats';
import EndTurnButton from '../EndTurnButton';
import Lane from '../Lane';
import DiscardPile from '../DiscardPile';
import DragLayer from '../DragLayer';
import StaticCard from '../StaticCard';
import GameLog from '../GameLog';
import Button from '../Button';
import './Game.scss';

const Game = () => {
  const {
    player,
    opponent,
    myTurn,
    gameState,
    dispatch,
    deckSize,
    zoomedCard,
    readonly,
    toggleZoom,
  } = useGameState();
  const [showGameLog, setShowGameLog] = useState(false);

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
        {!readonly && myTurn && gameState !== 'finished' ? <Alert>Your turn.</Alert> : null}
        {readonly ? null : <Hint />}
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
            <Button
              reversed
              disabled={readonly || gameState === 'abandoned' || gameState === 'finished'}
              onClick={() => dispatch({ type: 'resign' })}
            >
              Resign<br />
              game
            </Button>

            <PlayerStats player={opponent} />
            <PlayerBase player={opponent} />
          </Lane>

          <Lane type="ship">
            <PlayerFleet player={opponent} />

            <div className="deck">
              <FaceDownCard count={deckSize} />
            </div>
          </Lane>

          <Lane friendly type="ship">
            <DiscardPile />
            <PlayerFleet friendly player={player} />
          </Lane>

          <Lane friendly type="upgrade">
            <PlayerBase friendly player={player} />
            <PlayerStats friendly player={player} />
            <EndTurnButton />
          </Lane>

          <Lane friendly type="hand">
            <TransitionGroup component={null} exit={false}>
              {player.hand.map(c => (
                <CSSTransition key={c} classNames="card-" timeout={500}>
                  <Card inHand cardName={c} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Lane>
        </div>
      </div>
    </KeyMap>
  );
};

export default Game;
