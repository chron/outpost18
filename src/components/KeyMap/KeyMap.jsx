import React from 'react';
import { HotKeys } from 'react-hotkeys';

const keyMap = {
  END_TURN: 'e',
  RESIGN_GAME: 'q',
};

const KeyMap = ({ children, dispatch }) => {
  const handlers = {
    END_TURN: () => { dispatch({ type: 'endTurn' }); },
    RESIGN_GAME: () => { dispatch({ type: 'resign' }); },
  };

  return (
    <HotKeys root keyMap={keyMap} handlers={handlers}>
      {children}
    </HotKeys>
  );
};

export default KeyMap;
