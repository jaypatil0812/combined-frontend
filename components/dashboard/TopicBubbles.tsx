import React, { useMemo } from 'react';
import { Topic } from '../../types/dashboard-types';

interface TopicBubblesProps {
  topics: Topic[];
  onTopicSelect?: (topicName: string) => void;
  activeTopic?: string | null;
}

const TopicBubbles: React.FC<TopicBubblesProps> = ({ topics, onTopicSelect, activeTopic }) => {

  const getBubbleStyle = (topic: Topic, index: number) => {
    const positions = [
      { top: '50%', left: '50%', size: '36%' }, // AI Agents
      { top: '25%', left: '75%', size: '24%' }, // SaaS Growth
      { top: '75%', left: '75%', size: '22%' }, // Cold Email
      { top: '35%', left: '20%', size: '20%' }, // Personal Branding
      { top: '70%', left: '25%', size: '20%' }, // No-Code Tools
      { top: '85%', left: '45%', size: '18%' }, // Founder Health
    ];

    const pos = positions[index] || { top: '50%', left: '50%', size: '20%' };
    const isActive = activeTopic?.toLowerCase() === topic.name.toLowerCase();

    let colorClass = 'bg-[#0a0a0a] text-white border border-white/10';

    if (topic.score > 80) {
      colorClass = 'bg-black dark:bg-white text-white dark:text-black border-none shadow-2xl shadow-white/5';
    } else if (topic.score > 60) {
      colorClass = 'bg-gray-100 dark:bg-[#121212] text-black dark:text-white border border-white/10';
    }

    if (topic.sentiment === 'negative') {
      colorClass = 'bg-[#1a1a1a] text-gray-400 border border-white/5';
    }

    const baseStyle = isActive
      ? ' ring-4 ring-blue-500/50 scale-110 z-30'
      : ' opacity-80 hover:opacity-100';

    return {
      style: {
        top: pos.top,
        left: pos.left,
        width: pos.size,
        height: '0',
        paddingBottom: pos.size,
        transform: 'translate(-50%, -50%)'
      },
      className: `${colorClass} absolute rounded-full flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${baseStyle}`
    };
  };

  return (
    <div className="w-full h-full bg-[#101010] rounded-[20px] border border-white/10 shadow-sm relative overflow-hidden flex flex-col transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full p-5 z-10 bg-gradient-to-b from-white dark:from-black via-white/80 dark:via-black/80 to-transparent">
        <h3 className="text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-widest">Topic Heatmap</h3>
      </div>

      <div className="relative flex-1 mt-4">
        {topics.map((topic, index) => {
          const { style, className } = getBubbleStyle(topic, index);
          return (
            <div
              key={topic.name}
              style={style}
              className={className}
              onClick={() => onTopicSelect?.(topic.name)}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <span className="text-[11px] font-semibold leading-tight uppercase tracking-tight text-center">{topic.name}</span>
                <span className="text-[10px] opacity-40 mt-1 font-bold">{topic.score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicBubbles;
