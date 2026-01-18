import React, { useState, useMemo } from 'react';
import { Sparkles, Loader2, X, MessageSquare } from 'lucide-react';
import AttentionChart from './AttentionChart';
import RecentFeed from './RecentFeed';
import StatCard from './StatCard';
import TopicBubbles from './TopicBubbles';
import { DAILY_STATS, MOCK_POSTS, TOPICS } from '../../constants/dashboard-data';
import { analyzePerformance } from '../../services/dashboard-ai';

interface DeepDiveDashboardProps {
  isDarkMode: boolean;
}

const DeepDiveDashboard: React.FC<DeepDiveDashboardProps> = ({ isDarkMode }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsAnalyzing(true);
    setShowInsightsModal(true);
    setAiInsights(null);
    const result = await analyzePerformance(MOCK_POSTS, DAILY_STATS);
    setAiInsights(result);
    setIsAnalyzing(false);
  };

  const filteredPosts = useMemo(() => {
    if (!selectedTopic) return MOCK_POSTS;
    return MOCK_POSTS.filter(post => post.topic.toLowerCase() === selectedTopic.toLowerCase());
  }, [selectedTopic]);

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(prev => prev === topicName ? null : topicName);
  };

  return (
    <div className="flex flex-col h-full gap-4 relative">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#101010] p-3 rounded-xl border border-white/10 shadow-sm flex-none">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-widest">Dashboard</h2>
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
            <AttentionChart data={DAILY_STATS} isDarkMode={isDarkMode} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            <StatCard title="Impressions" value="1.2M" growth={15} />
            <StatCard title="Engagements" value="350K" growth={8} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">
          <div className="lg:col-span-2 h-full min-h-0">
            <RecentFeed items={filteredPosts} title={selectedTopic ? `Your Posts: ${selectedTopic}` : "Your Posts"} />
          </div>

          <div className="lg:col-span-1 h-full min-h-0">
            <TopicBubbles topics={TOPICS} onTopicSelect={handleTopicSelect} activeTopic={selectedTopic} />
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
