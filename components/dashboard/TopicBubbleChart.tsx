import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TopicSummary } from '../../types/dashboard-types';

interface TopicBubbleChartProps {
  data: TopicSummary[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs">
        <p className="text-white font-bold mb-1">Topic: {data.name}</p>
        <p className="text-slate-400">Posts: <span className="text-gray-200">{data.count}</span></p>
        <p className="text-slate-400">Avg Virality: <span className="text-gray-200">{data.avgVirality}%</span></p>
        <div className={`mt-2 px-2 py-0.5 rounded-full inline-block font-bold ${data.performance === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
          {data.performance} Performance
        </div>
      </div>
    );
  }
  return null;
};

const TopicBubbleChart: React.FC<TopicBubbleChartProps> = ({ data }) => {
  // We need to spread the data across the X axis for visual clarity
  const chartData = data.map((d, i) => ({
    ...d,
    x: i * 20 + 10, // Distribute horizontally
    y: 50, // Keep in center line
  }));

  return (
    <div className="w-full h-full bg-[#101010] border border-white/10 rounded-[20px] p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Topic Clusters</h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-500/20" />
            <span>High Performance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-400 to-slate-500" />
            <span>Standard</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
            <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
            <ZAxis type="number" dataKey="count" range={[1000, 6000]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.performance === 'High' ? 'url(#greenGradient)' : 'url(#greyGradient)'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Scatter>
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="greyGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-slate-800 pt-4">
        <p>Bubble size represents post volume</p>
        <p>X-Axis distributed for clarity</p>
      </div>
    </div>
  );
};

export default TopicBubbleChart;
