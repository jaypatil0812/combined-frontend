import React, { useState, useMemo } from 'react';
import { MOCK_POSTS } from '../../constants/dashboard-data';
import { Platform } from '../../types/dashboard-types';
import MetricsTable from './MetricsTable';
import {
  LayoutGrid,
  Twitter,
  Linkedin,
  TrendingUp,
} from 'lucide-react';

const CommandCenterDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'All' | Platform.TWITTER | Platform.LINKEDIN>('All');

  const filteredPosts = useMemo(() => {
    if (filter === 'All') return MOCK_POSTS;
    return MOCK_POSTS.filter(p => p.platform === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const totalPosts = filteredPosts.length;
    const totalLikes = filteredPosts.reduce((acc, post) => acc + post.likes, 0);
    const totalComments = filteredPosts.reduce((acc, post) => acc + post.comments, 0);
    const totalEngagement = totalLikes + totalComments;

    return {
      totalPosts,
      totalEngagement,
      totalLikes,
      totalComments
    };
  }, [filteredPosts]);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 flex-none">
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 tracking-tight">Dashboard</h1>
        </div>

        <div className="flex justify-center">
          <div className="flex p-1 bg-gray-100 dark:bg-[#121212] rounded-xl border border-white/10 shadow-sm">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${filter === 'All' ? 'bg-white text-black shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
            >
              <LayoutGrid size={12} strokeWidth={3} />
              ALL
            </button>
            <button
              onClick={() => setFilter(Platform.TWITTER)}
              className={`px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${filter === Platform.TWITTER ? 'bg-white text-black shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
            >
              <Twitter size={12} strokeWidth={3} />
              X
            </button>
            <button
              onClick={() => setFilter(Platform.LINKEDIN)}
              className={`px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${filter === Platform.LINKEDIN ? 'bg-white text-black shadow-sm' : 'text-[#8e8e93] hover:text-gray-200'}`}
            >
              <Linkedin size={12} strokeWidth={3} />
              LINKEDIN
            </button>
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>

      {/* Primary Metric Boxes - CHATBOT STYLE */}
      <div className="h-[200px] flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#101010] border border-white/10 rounded-[20px] px-5 py-6 flex flex-col justify-center items-center gap-3 group hover:border-white/20 transition-all">
          <div className="flex flex-col items-center z-10 text-center">
            <span className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-widest mb-1">POSTS OUTPUT</span>
            <div className="flex items-baseline gap-4">
              <span className="text-[52px] font-bold text-gray-200 tracking-tighter leading-none">
                {stats.totalPosts}
              </span>
              <div className="flex flex-col bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                <span className="text-[11px] font-bold text-gray-200 flex items-center gap-0.5">
                  <TrendingUp size={12} strokeWidth={3} /> +12%
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-12 items-center mt-2 pt-4 border-t border-white/10 w-full justify-center z-10">
            <div className="text-center">
              <span className="text-[11px] font-medium text-[#8e8e93] uppercase">Avg / Week</span>
              <p className="text-sm font-semibold text-gray-200">4.2</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-[11px] font-medium text-[#8e8e93] uppercase">Efficiency</span>
              <p className="text-sm font-semibold text-gray-200 uppercase">High</p>
            </div>
          </div>
        </div>

        <div className="bg-[#101010] border border-white/10 rounded-[20px] px-5 py-6 flex flex-col justify-center items-center gap-3 group hover:border-white/20 transition-all">
          <div className="flex flex-col items-center z-10 text-center">
            <span className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-widest mb-1">TOTAL IMPACT</span>
            <div className="flex items-baseline gap-4">
              <span className="text-[52px] font-bold text-gray-200 tracking-tighter leading-none">
                {stats.totalEngagement >= 1000 ? `${(stats.totalEngagement / 1000).toFixed(1)}k` : stats.totalEngagement}
              </span>
              <div className="flex flex-col bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                <span className="text-[11px] font-bold text-gray-200 flex items-center gap-0.5">
                  <TrendingUp size={12} strokeWidth={3} /> +8.4%
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-12 items-center mt-2 pt-4 border-t border-white/10 w-full justify-center z-10">
            <div className="text-center">
              <span className="text-[11px] font-medium text-[#8e8e93] uppercase">LIKES</span>
              <p className="text-sm font-semibold text-gray-200">{stats.totalLikes.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-[11px] font-medium text-[#8e8e93] uppercase">COMMS</span>
              <p className="text-sm font-semibold text-gray-200">{stats.totalComments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MetricsTable posts={filteredPosts} />
      </div>
    </div>
  );
};

export default CommandCenterDashboard;
