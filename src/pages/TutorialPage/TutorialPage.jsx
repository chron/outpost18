import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import { GameProvider } from '../../components/GameProvider';
import Game from '../../components/Game';
import TUTORIAL_DATA from '../../logic/tutorial';
import reducer from '../../logic/reducer';
import gameStatePresenter from '../../functions/utils/gameStatePresenter';
import TutorialMessage from '../../components/TutorialMessage/TutorialMessage';
import './TutorialPage.scss';

const { script, ...INITIAL_GAME_STATE } = TUTORIAL_DATA;
const TUTORIAL_GAME_ID = 'tutorial';
const TUTORIAL_PLAYER_ID = 'tutorial-player';
const TUTORIAL_ENEMY_ID = 'tutorial-enemy';

export default function TutorialPage() {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const currentStep = script[tutorialStep];

  // Auto-apply script steps with `enemy: true` without any user input
  useEffect(() => {
    if (currentStep && currentStep.enemy) {
      setTutorialStep(tutorialStep + 1);
      setGameState(reducer(gameState, currentStep, TUTORIAL_ENEMY_ID));
    }
  }, [currentStep]);

  const dispatch = (playerId, _gameId, action) => {
    if (JSON.stringify(action) === JSON.stringify(currentStep)) {
      setTutorialStep(tutorialStep + 1);
      setGameState(reducer(gameState, action, playerId));
    } // else feedback?
  };

  const gameStateView = gameStatePresenter(gameState, TUTORIAL_GAME_ID, TUTORIAL_PLAYER_ID);

  const nextAction = tutorialStep >= script.length
    ? () => navigate('/menu')
    : () => setTutorialStep(tutorialStep + 1);

  return (
    <GameProvider
      gameId={TUTORIAL_GAME_ID}
      playerId={TUTORIAL_PLAYER_ID}
      gameState={gameStateView}
      gameStateReducer={dispatch}
    >
      { currentStep && currentStep.message
        ? <TutorialMessage message={currentStep.message} onClick={nextAction} />
        : null
      }
      <Game />
      <button className="tutorial-page__help-button">
        ?
      </button>
    </GameProvider>
  );
}
