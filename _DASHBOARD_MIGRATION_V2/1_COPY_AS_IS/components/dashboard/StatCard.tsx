
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  growth: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth }) => {
  const isPositive = growth >= 0;
  return (
    <div className="bg-[#101010] p-6 rounded-[20px] border border-white/10 shadow-sm flex flex-col justify-between h-full min-h-0 relative overflow-hidden group hover:border-black dark:hover:border-white transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-gray-400 dark:text-[#8e8e93] font-semibold text-[10px] uppercase tracking-widest mb-1">{title}</h3>
          <span className="text-4xl font-semibold text-gray-900 dark:text-gray-200 tracking-tighter">{value}</span>
        </div>
        
        {/* Large Decorative Circle */}
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#121212] border border-white/10 shadow-inner" />
        </div>
      </div>
      
      <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${isPositive ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-[#8e8e93]'}`}>
         {isPositive ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
         <span>{Math.abs(growth)}% Performance Lift</span>
      </div>
    </div>
  );
};

export default StatCard;
