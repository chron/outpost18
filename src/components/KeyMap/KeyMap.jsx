import React, { useRef } from 'react';
import { HotKeys } from "react-hotkeys";

const keyMap = {
  END_TURN: "e",
};

const KeyMap = ({ children, dispatch }) => {
  const handlers = {
    END_TURN: () => { dispatch({ type: 'endTurn' }) },
  };

  return (
    <HotKeys root keyMap={keyMap} handlers={handlers}>
      {children}
    </HotKeys>
  );
};

export default KeyMap;
