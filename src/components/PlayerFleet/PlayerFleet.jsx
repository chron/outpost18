import React from 'react';
import Ship from '../Ship';

export default function PlayerFleet({ player, friendly }) {
  const ships = player.inPlay.filter(s => s.mode === 'ship');

  return (
    <div className="fleet">
      {ships.map(({ cardName, canAttack, attacking, attackAdded }) => (
        <Ship
          key={cardName}
          friendly={friendly}
          owner={player}
          cardName={cardName}
          canAttack={canAttack}
          attacking={attacking}
          attackAdded={attackAdded}
        />
      ))}
    </div>
  );
}
