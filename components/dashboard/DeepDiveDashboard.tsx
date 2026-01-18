import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Loader2, X, MessageSquare } from 'lucide-react';
import AttentionChart from './AttentionChart';
import RecentFeed from './RecentFeed';
import StatCard from './StatCard';
import TopicBubbles from './TopicBubbles';
import { analyzePerformance } from '../../services/dashboard-ai';
import { fetchDashboardData, DashboardData } from '../../services/dashboard-api';
import { ContentItem, DailyStat, Topic } from '../../types/dashboard-types';

interface DeepDiveDashboardProps {
  isDarkMode: boolean;
}

const DeepDiveDashboard: React.FC<DeepDiveDashboardProps> = ({ isDarkMode }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // State for real backend data
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [metrics, setMetrics] = useState<DashboardData['metrics']>({
    totalPosts: 0,
    totalEngagements: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [lastSynced, setLastSynced] = useState<string>('');

  // Fetch dashboard data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setPosts(data.posts);
        setDailyStats(data.dailyStats);
        setTopics(data.topics);
        setMetrics(data.metrics);
        setLastSynced(data.lastSynced);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // You can add error state handling here if needed
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleGenerateInsights = async () => {
    setIsAnalyzing(true);
    setShowInsightsModal(true);
    setAiInsights(null);
    const result = await analyzePerformance(posts, dailyStats);
    setAiInsights(result);
    setIsAnalyzing(false);
  };

  const filteredPosts = useMemo(() => {
    if (!selectedTopic) return posts;
    return posts.filter(post => post.topic.toLowerCase() === selectedTopic.toLowerCase());
  }, [selectedTopic, posts]);

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(prev => prev === topicName ? null : topicName);
  };

  // Helper function to format the last synced timestamp
  const getRelativeTime = (isoTimestamp: string): string => {
    if (!isoTimestamp) return '';

    try {
      const now = new Date();
      const synced = new Date(isoTimestamp);
      const diffMs = now.getTime() - synced.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="animate-spin mb-4 text-gray-600 dark:text-gray-400" size={48} />
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Loading Engine Data...</p>
      </div>
    );
  }

  // Show error state if metrics are missing (likely backend down)
  if (!metrics) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <X className="text-red-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Connection Failed</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Could not connect to the Engine API. Ensure the backend server is running on port 5000.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-semibold uppercase tracking-widest transition-transform active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 relative">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#101010] p-3 rounded-xl border border-white/10 shadow-sm flex-none">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-widest">Dashboard</h2>
          {lastSynced && (
            <span className="text-xs text-gray-500 dark:text-[#8e8e93] ml-2">
              Last updated: {getRelativeTime(lastSynced)}
            </span>
          )}
        </div>
        <button
          onClick={handleGenerateInsights}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
          <span>{isAnalyzing ? "Processing..." : "Generate Analysis"}</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-[45%_1fr] gap-4">

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full min-h-0">
          <div className="lg:col-span-3 bg-[#101010] rounded-[20px] border border-white/10 shadow-sm p-1 flex flex-col h-full overflow-hidden">
            <AttentionChart data={dailyStats || []} isDarkMode={isDarkMode} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            {/* Posts Output Card */}
            <div className="bg-[#101010] p-6 rounded-[20px] border border-white/10 shadow-sm flex flex-col justify-between h-full min-h-0 relative overflow-hidden group hover:border-white transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-[#8e8e93] font-semibold text-[10px] uppercase tracking-widest mb-2">POSTS OUTPUT</h3>
                  <span className="text-5xl font-semibold text-gray-200 tracking-tighter leading-none">{metrics?.totalPosts || 0}</span>
                </div>
                {metrics?.postsGrowth && (
                  <div className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-1.5 rounded-full border border-white/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    </svg>
                    <span className="text-xs font-bold text-gray-200">{metrics.postsGrowth}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-wider mb-1.5">AVG / WEEK</div>
                  <div className="text-xl font-bold text-gray-200">{metrics?.avgPostsPerWeek || '0'}</div>
                </div>
                <div>
                  <div className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-wider mb-1.5">EFFICIENCY</div>
                  <div className="text-xl font-bold text-gray-200">{metrics?.efficiency || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Engagements Card */}
            <div className="bg-[#101010] p-6 rounded-[20px] border border-white/10 shadow-sm flex flex-col justify-between h-full min-h-0 relative overflow-hidden group hover:border-white transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-[#8e8e93] font-semibold text-[10px] uppercase tracking-widest mb-2">ENGAGEMENTS</h3>
                  <span className="text-5xl font-semibold text-gray-200 tracking-tighter leading-none">{metrics?.totalEngagements?.toLocaleString() || '0'}</span>
                </div>
                {metrics?.engagementsGrowth && (
                  <div className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-1.5 rounded-full border border-white/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    </svg>
                    <span className="text-xs font-bold text-gray-200">{metrics.engagementsGrowth}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-wider mb-1.5">LIKES</div>
                  <div className="text-xl font-bold text-gray-200">{metrics?.totalLikes?.toLocaleString() || '0'}</div>
                </div>
                <div>
                  <div className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-wider mb-1.5">COMMS</div>
                  <div className="text-xl font-bold text-gray-200">{metrics?.totalComments?.toLocaleString() || '0'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">
          <div className="lg:col-span-2 h-full min-h-0">
            <RecentFeed items={filteredPosts || []} title={selectedTopic ? `Your Posts: ${selectedTopic}` : "Your Posts"} />
          </div>

          <div className="lg:col-span-1 h-full min-h-0">
            <TopicBubbles topics={topics || []} onTopicSelect={handleTopicSelect} activeTopic={selectedTopic} />
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {showInsightsModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 rounded-[20px]">
          <div className="bg-[#101010] rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[90%] flex flex-col animate-in zoom-in-95 duration-200 border border-white/10">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-black dark:text-gray-200">
                <Sparkles size={20} />
                <h3 className="font-semibold text-lg">AI Analysis</h3>
              </div>
              <button
                onClick={() => setShowInsightsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-[#8e8e93]">
                  <Loader2 size={40} className="animate-spin mb-4 text-black dark:text-gray-200" />
                  <p className="text-sm font-bold uppercase tracking-widest">Running Intelligence Audit...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-start gap-3">
                    <div className="bg-gray-100 dark:bg-[#121212] p-4 rounded-[20px] rounded-tl-none border border-white/10 max-w-[90%]">
                      <div className="text-gray-800 dark:text-white text-sm font-medium leading-relaxed prose prose-invert prose-sm">
                        {aiInsights?.split('\n').map((line, i) => (
                          <p key={i} className={line.startsWith('-') || line.startsWith('*') ? 'ml-4' : 'mb-2 last:mb-0'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isAnalyzing && (
              <div className="p-4 bg-gray-50 dark:bg-[#050505] rounded-b-2xl border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="px-6 py-2 border border-white/10 text-gray-500 dark:text-[#8e8e93] rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-semibold uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-black/10"
                >
                  <MessageSquare size={14} />
                  Continue in chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepDiveDashboard;
