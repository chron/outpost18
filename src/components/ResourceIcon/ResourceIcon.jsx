import React from 'react';
import * as images from '../../assets/images/icons/*.png';
import './ResourceIcon.scss';

export default function ResourceIcon({ resource, num, cssModifier }) {
  // TODO: This cssModifier thing is a bit weird
  if (!num) { return null; }

  return (
    <>
      {Array(num).fill(1).map((_, i) => (
        <img
          key={i}
          className={`resource-icon resource-icon--${cssModifier}`}
          alt={resource}
          src={images[resource]}
        />
      ))}
    </>
  );
}
