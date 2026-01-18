import React, { useState } from 'react';
import { ContentItem, Platform } from '../../types/dashboard-types';
import { Twitter, Linkedin, Youtube, MoreHorizontal, ChevronRight, X, ExternalLink } from 'lucide-react';

interface RecentFeedProps {
  items: ContentItem[];
  title?: string;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case Platform.TWITTER:
      return <Twitter size={14} className="text-gray-900 dark:text-gray-200" />;
    case Platform.LINKEDIN:
      return <Linkedin size={14} className="text-gray-900 dark:text-gray-200" />;
    case Platform.YOUTUBE:
      return <Youtube size={14} className="text-gray-900 dark:text-gray-200" />;
    default:
      return null;
  }
};

const GradeBadge = ({ grade }: { grade: string }) => {
  let colors = '';
  switch (grade) {
    case 'S': colors = 'bg-white text-black border-white'; break;
    case 'A': colors = 'bg-gray-100 dark:bg-[#262626] text-black dark:text-white border-white/10'; break;
    case 'B': colors = 'bg-transparent text-gray-400 dark:text-[#8e8e93] border-white/10'; break;
    default: colors = 'bg-transparent text-gray-300 border-white/10';
  }

  return (
    <span className={`font-semibold w-6 h-6 flex items-center justify-center rounded-md text-[10px] border ${colors}`}>
      {grade}
    </span>
  );
};

const RecentFeed: React.FC<RecentFeedProps> = ({ items, title = "Your Posts" }) => {
  const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null);

  return (
    <div className="bg-[#101010] rounded-[20px] border border-white/10 shadow-sm flex flex-col h-full overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center flex-none bg-gray-50/10 dark:bg-[#050505]">
        <h2 className="text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-widest">{title}</h2>
        <button className="text-gray-400 hover:text-black dark:hover:text-gray-200">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10">
            <tr className="text-gray-400 dark:text-[#8e8e93] text-[10px] uppercase font-semibold tracking-widest border-b border-gray-50 dark:border-[#1a1a1a]">
              <th className="px-6 py-3 font-semibold">Source</th>
              <th className="px-6 py-3 font-semibold w-1/2">Snippet</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold text-right">Reach</th>
              <th className="px-6 py-3 font-semibold text-center">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-colors">
                <td className="px-6 py-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  <PlatformIcon platform={item.platform} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1 group/snippet">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm truncate max-w-[280px]" title={item.snippet}>
                      {item.snippet}
                    </p>
                    <button
                      onClick={() => setSelectedPost(item)}
                      className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all shrink-0"
                    >
                      <ChevronRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-500 dark:text-[#8e8e93] text-[10px] font-semibold whitespace-nowrap uppercase">
                  {item.date}
                </td>
                <td className="px-6 py-3 text-gray-900 dark:text-gray-200 text-[11px] font-semibold text-right tracking-tight">
                  {item.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-center">
                    <GradeBadge grade={item.grade} />
                  </div>
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

export default RecentFeed;
