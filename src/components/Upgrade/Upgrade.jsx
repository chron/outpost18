import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import './Upgrade.scss';

function Upgrade({ cardName, friendly = true }) {
  const { cards } = useContext(GameContext);
  const { name, shields, defender, ion, labour, ore, draws } = cards.find(c => c.name === cardName);

  return (
    <div className={`upgrade ${friendly ? '' : 'upgrade--enemy'}`}>
      <div className={`upgrade__shields upgrade__shields--reverse ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}{defender ? '!' : ''}
      </div>

      <div className="upgrade__powers">
        {Array(ion || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">🔋</div>)}
        {Array(labour || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">🔧</div>)}
        {Array(ore || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">💎</div>)}
        {defender ? <div className="upgrade__power">Def</div> : ''}
        {Array(draws || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">+<br />Draw</div>)}
      </div>

      <div className={`upgrade__shields ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}{defender ? '!' : ''}
      </div>
    </div>
  );
}

export default Upgrade;
