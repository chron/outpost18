import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import './Upgrade.scss';

function Upgrade({ playerName, cardName }) {
  const { cards } = useContext(GameContext);
  const { name, defense, defender, ion, labour, ore, draws } = cards.find(c => c.name === cardName);

  return (
    <div className="upgrade">
      <div className={`upgrade__defense upgrade__defense--reverse ${defender ? 'upgrade__defense--defender' : ''}`}>
        {defense}{defender ? '!' : ''}
      </div>

      <div className="upgrade__powers">
        {Array(ion || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">🔋</div>)}
        {Array(labour || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">🔧</div>)}
        {Array(ore || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">💎</div>)}
        {defender ? <div className="upgrade__power">Def</div> : ''}
        {Array(draws || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">+<br />Draw</div>)}
      </div>

      <div className={`upgrade__defense ${defender ? 'upgrade__defense--defender' : ''}`}>
        {defense}{defender ? '!' : ''}
      </div>
    </div>
  );
}

export default Upgrade;
