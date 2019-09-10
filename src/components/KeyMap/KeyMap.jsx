import React from 'react';
import { HotKeys } from 'react-hotkeys';

const keyMap = {
  END_TURN: 'e',
  RESIGN_GAME: 'q',
  TOGGLE_GAME_LOG: 'l',
};

const KeyMap = ({ children, handlers, dispatch }) => {
  const allHandlers = {
    ...handlers,
    END_TURN: () => { dispatch({ type: 'endTurn' }); },
    RESIGN_GAME: () => { dispatch({ type: 'resign' }); },
  };

  return (
    <HotKeys root keyMap={keyMap} handlers={allHandlers}>
      {children}
    </HotKeys>
  );
};

export default KeyMap;
