import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import { GameProvider } from '../../components/GameProvider';
import Game from '../../components/Game';
import TUTORIAL_DATA from '../../logic/tutorial';
import reducer from '../../logic/reducer';
import gameStatePresenter from '../../functions/utils/gameStatePresenter';
import TutorialMessage from '../../components/TutorialMessage/TutorialMessage';
import { useApi, useAuth } from '../../hooks';
import './TutorialPage.scss';

const { script, ...INITIAL_GAME_STATE } = TUTORIAL_DATA;
const TUTORIAL_GAME_ID = 'tutorial';
const TUTORIAL_PLAYER_ID = 'tutorial-player';
const TUTORIAL_ENEMY_ID = 'tutorial-enemy';
const MESSAGE_DELAY = 1000; // ms

export default function TutorialPage({ playerId }) {
  const { logEvent } = useApi();
  const { authToken } = useAuth();
  const [tutorialStep, setTutorialStep] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [showLastMessage, setShowLastMessage] = useState(false);
  const [errors, setErrors] = useState(0);
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const currentStep = script[tutorialStep];

  useEffect(() => {
    logEvent(playerId, 'START_TUTORIAL', authToken);
  }, []);

  useEffect(() => {
    if (tutorialStep === script.length) {
      logEvent(playerId, 'FINISH_TUTORIAL', authToken);
    }
  }, [tutorialStep]);

  // Auto-apply script steps with `enemy: true` without any user input
  useEffect(() => {
    if (!currentStep) { return; }

    if (currentStep.enemy) {
      setTutorialStep(tutorialStep + 1);
      setGameState(reducer(gameState, currentStep, TUTORIAL_ENEMY_ID));
    } else if (currentStep.message) {
      setLastMessage(currentStep.message);
    }
  }, [currentStep]);

  const dispatch = (playerId, _gameId, action) => {
    if (action.type === 'resign') {
      navigate('/menu');
      return;
    }

    if (JSON.stringify(action) === JSON.stringify(currentStep)) {
      const nextStep = script[tutorialStep + 1];

      if ((!currentStep.message && !currentStep.enemy) && nextStep && (nextStep.message || nextStep.enemy)) {
        setTimeout(
          () => setTutorialStep(s => s + 1),
          MESSAGE_DELAY
        );
      } else {
        setTutorialStep(tutorialStep + 1);
      }
      setGameState(reducer(gameState, action, playerId));
      setErrors(0);
    } else if (errors >= 2) {
      setShowLastMessage(true);
      setErrors(0);
    } else {
      setErrors(errors + 1);
    }
  };

  const gameStateView = gameStatePresenter(gameState, TUTORIAL_GAME_ID, TUTORIAL_PLAYER_ID);

  const showInstructions = () => {
    setTutorialStep(tutorialStep - 1);
  };

  return (
    <GameProvider
      gameId={TUTORIAL_GAME_ID}
      playerId={TUTORIAL_PLAYER_ID}
      gameState={gameStateView}
      gameStateReducer={dispatch}
    >
      { showLastMessage
        ? <TutorialMessage message={lastMessage} onClick={() => setShowLastMessage(false)} />
        : null
      }
      { currentStep && currentStep.message
        ? (
          <TutorialMessage
            highlight={currentStep.highlight}
            overlay={currentStep.overlay}
            message={currentStep.message}
            onClick={() => setTutorialStep(tutorialStep + 1)}
          />
        ) : null
      }
      <Game hintOverride={currentStep && currentStep.message ? null : lastMessage} />
      <button type="button" className="tutorial-page__help-button" onClick={showInstructions}>
        ?
      </button>
    </GameProvider>
  );
}
