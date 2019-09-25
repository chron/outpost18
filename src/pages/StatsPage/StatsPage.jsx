import React, { useState, useEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { getStats } from '../../lib/apiClient';
import Loading from '../../components/Loading';
import './StatsPage.scss';

export default function StatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(data => setStats(data));
  }, []);

  if (stats === null) { return <Loading />; }

  return (
    <div className="page page--stats center-children">
      <div className="panel">
        <h1>First player advantage</h1>

        <div className="chart-container">
          <h2>AI Games</h2>
          <h2>PvP Games</h2>
        </div>

        <div className="chart-container">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={stats.aiGames.firstPlayerAdvantage}
              cx={200}
              cy={200}
              outerRadius={80}
              fill="#8884d8"
              label
            />

            <Tooltip />
          </PieChart>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={stats.humanGames.firstPlayerAdvantage}
              cx={200}
              cy={200}
              outerRadius={80}
              fill="#82ca9d"
              label
            />

            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
