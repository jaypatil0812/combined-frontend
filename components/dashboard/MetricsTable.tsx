import React, { useState } from 'react';
import { ContentItem, Platform } from '../../types/dashboard-types';
import { Twitter, Linkedin, ChevronRight, X, ExternalLink } from 'lucide-react';

interface MetricsTableProps {
  posts: ContentItem[];
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case Platform.TWITTER:
      return <Twitter size={18} className="text-gray-900 dark:text-gray-200" strokeWidth={2} />;
    case Platform.LINKEDIN:
      return <Linkedin size={18} className="text-gray-900 dark:text-gray-200" strokeWidth={2} />;
    default:
      return null;
  }
};

const GradeBadge = ({ grade }: { grade: string }) => {
  let style = "";
  switch (grade) {
    case 'S': style = "bg-white text-black border-white"; break;
    case 'A': style = "bg-gray-100 text-black dark:bg-[#1a1a1a] dark:text-white border-white/10"; break;
    case 'B': style = "bg-gray-50 text-gray-600 dark:bg-[#0a0a0a] dark:text-[#8e8e93] border-white/10"; break;
    default: style = "bg-transparent text-gray-400 dark:text-[#8e8e93] border-white/10";
  }
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border uppercase tracking-wider transition-colors ${style}`}>
      {grade}
    </span>
  );
};

const MetricsTable: React.FC<MetricsTableProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null);

  return (
    <div className="w-full h-full bg-[#101010] border border-white/10 rounded-[20px] flex flex-col overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gray-50/30 dark:bg-[#0a0a0a]/50">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Your Posts</h3>
        <span className="text-xs font-bold text-gray-400 dark:text-[#8e8e93] uppercase tracking-widest bg-gray-100 dark:bg-[#121212] px-3 py-1 rounded-lg border border-white/10">
          {posts.length} Records
        </span>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10 border-b border-white/10">
            <tr className="text-[10px] font-semibold uppercase text-gray-400 dark:text-[#8e8e93] tracking-[0.2em]">
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Segment</th>
              <th className="px-6 py-3 w-1/3">Snippet</th>
              <th className="px-6 py-3 text-right">Reach</th>
              <th className="px-6 py-3 text-right">Comms</th>
              <th className="px-6 py-3 text-center">Score</th>
              <th className="px-6 py-3 text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-colors group">
                <td className="px-6 py-4">
                  <PlatformIcon platform={post.platform} />
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-[#8e8e93] whitespace-nowrap uppercase">
                  {post.date}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-white text-[10px] font-semibold uppercase tracking-wider border border-white/10">
                    {post.topic}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-sm" title={post.snippet}>
                      {post.snippet}
                    </p>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                    >
                      <ChevronRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-200">
                  {post.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-200">
                  {post.comments.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`text-xs font-semibold ${post.viralityScore > 80 ? 'text-black dark:text-gray-200' : 'text-gray-400 dark:text-[#8e8e93]'}`}>
                      {post.viralityScore}%
                    </span>
                    <div className="w-16 h-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${post.viralityScore > 80 ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-[#404040]'}`}
                        style={{ width: `${post.viralityScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <GradeBadge grade={post.grade} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-[20px] shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={selectedPost.platform} />
                <h3 className="font-semibold text-sm uppercase tracking-widest text-black dark:text-gray-200">Post Detail</h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10">
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-200 leading-relaxed mb-12">
                {selectedPost.fullContent}
              </p>

              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Platform</span>
                  <span className="text-xs font-semibold dark:text-gray-200">{selectedPost.platform === Platform.TWITTER ? 'X' : selectedPost.platform}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Date</span>
                  <span className="text-xs font-semibold dark:text-gray-200">{selectedPost.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Reactions</span>
                  <span className="text-xs font-semibold dark:text-gray-200">{selectedPost.likes.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Comments</span>
                  <span className="text-xs font-semibold dark:text-gray-200">{selectedPost.comments.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-black border-t border-white/10 flex justify-end items-center gap-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <a
                href={selectedPost.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black border border-gray-200 dark:border-none rounded-xl text-[10px] font-semibold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <ExternalLink size={14} strokeWidth={3} />
                Open in {selectedPost.platform === Platform.TWITTER ? 'X' : selectedPost.platform}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsTable;
