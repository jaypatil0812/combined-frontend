import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyStat, Platform } from '../../types/dashboard-types';
import { Twitter, Linkedin, Youtube } from 'lucide-react';

interface AttentionChartProps {
  data: DailyStat[];
  isDarkMode?: boolean;
}

const AttentionChart: React.FC<AttentionChartProps> = ({ data, isDarkMode = false }) => {
  const [platformFilter, setPlatformFilter] = useState<'Aggregate' | Platform.TWITTER | Platform.LINKEDIN>('Aggregate');

  const chartData = data.map(d => ({
    ...d,
    displayValue: platformFilter === 'Aggregate'
      ? d.twitter + d.linkedin + d.youtube
      : platformFilter === Platform.TWITTER ? d.twitter : d.linkedin
  }));

  const axisColor = isDarkMode ? '#525252' : '#94a3b8';
  const gridColor = isDarkMode ? '#171717' : '#f1f5f9';
  const tooltipBg = isDarkMode ? '#000000' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#262626' : '#e2e8f0';
  const tooltipText = isDarkMode ? '#ffffff' : '#1e293b';

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex justify-between items-start mb-6 flex-none">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-1">Total Engagement</h2>

        </div>

        {/* Platform Switcher Buttons */}
        <div className="flex items-center bg-gray-100 dark:bg-[#121212] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setPlatformFilter('Aggregate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${platformFilter === 'Aggregate' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${platformFilter === 'Aggregate' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-400'}`}></div>
            Aggregate
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-[#1a1a1a] mx-1"></div>
          <button
            onClick={() => setPlatformFilter(Platform.TWITTER)}
            className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition-all ${platformFilter === Platform.TWITTER ? 'bg-[#262626] text-white shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
          >
            <Twitter size={14} fill={platformFilter === Platform.TWITTER ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => setPlatformFilter(Platform.LINKEDIN)}
            className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition-all ${platformFilter === Platform.LINKEDIN ? 'bg-[#262626] text-white shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
          >
            <Linkedin size={14} fill={platformFilter === Platform.LINKEDIN ? "currentColor" : "none"} />
          </button>
          <button
            disabled
            className="flex items-center justify-center px-3 py-1.5 text-gray-300 dark:text-gray-800 cursor-not-allowed"
          >
            <Youtube size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: `1px solid ${tooltipBorder}`,
                backgroundColor: tooltipBg,
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                fontSize: '11px',
                padding: '12px',
                color: tooltipText,
                fontWeight: 'bold'
              }}
              itemStyle={{ color: tooltipText }}
              formatter={(value: number) => [value.toLocaleString(), 'Engagements']}
            />
            <Area
              type="monotone"
              dataKey="displayValue"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttentionChart;
