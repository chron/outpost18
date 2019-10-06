import React from 'react';
import { DndProvider } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import { IdentityContextProvider } from 'react-netlify-identity';
import { IDENTITY_URL } from '../constants';

const TOUCH_OPTIONS = {
  enableMouseEvents: true,
};

export default function AppWrapper({ children }) {
  return (
    <DndProvider backend={TouchBackend} options={TOUCH_OPTIONS}>
      <IdentityContextProvider url={IDENTITY_URL}>
        {children}
      </IdentityContextProvider>
    </DndProvider>
  );
}
