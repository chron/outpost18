import React from 'react';
import { navigate } from '@reach/router';
import { useLocalStorage } from '../../hooks';
import BackBar from '../../components/BackBar';
import Controls from '../../components/Controls';
import Button from '../../components/Button';
import './CreateGamePage.scss';

function CreateGamePage({ joinGameFunc, gameType }) {
  const [nextGameTimed, setNextGameTimed] = useLocalStorage('enableTurnTimer', false);
  const [nextGameReportResult, setNextGameReportResult] = useLocalStorage('reportResult', true);

  const nextGamePublic = gameType === 'public';

  const createGame = () => {
    const settings = nextGamePublic
      ? {}
      : { turnLength: nextGameTimed ? 60 : 0, reportResult: nextGameReportResult };
      
    joinGameFunc(null, null, nextGamePublic, false, settings).then(() => navigate('/game'));
  };

  return (
    <div className="page page--create center-children">
      <div className="panel">
        <h1>Game setup</h1>

        <div className="game-setting">
          <label htmlFor="nextGameTimed" className="welcome__label">
            <input
              id="nextGameTimed"
              type="checkbox"
              disabled={nextGamePublic}
              onChange={e => setNextGameTimed(e.target.checked)}
              checked={nextGameTimed}
            />

            Enable a 60 second turn timer
          </label>
        </div>

        <div className="game-setting">
          <label htmlFor="nextGameReportResult" className="welcome__label">
            <input
              id="nextGameReportResult"
              type="checkbox"
              disabled={nextGamePublic}
              onChange={e => setNextGameReportResult(e.target.checked)}
              checked={nextGameReportResult}
            />

            Report game result to Discord
          </label>
        </div>

        <Controls>
          <Button className="button" onClick={createGame}>
            Create Game
          </Button>
        </Controls>
      </div>

      <BackBar />
    </div>
  );
}

export default CreateGamePage;
