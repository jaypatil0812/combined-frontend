import { ContentItem, DailyStat, Topic, Platform } from '../types/dashboard-types';

/**
 * Interface for the complete dashboard data response from the backend API
 */
export interface DashboardData {
  posts: ContentItem[];
  dailyStats: DailyStat[];
  topics: Topic[];
  metrics: {
    totalPosts: number;
    totalEngagements: number;
    totalLikes: number;
    totalComments: number;
    postsGrowth?: string;
    engagementsGrowth?: string;
    avgPostsPerWeek?: number;
    efficiency?: string;
  };
  lastSynced: string; // ISO timestamp
}

/**
 * Fetches dashboard data from the backend API
 * @returns Promise with complete dashboard data
 * @throws Error if the API call fails
 */
// Internal interface matching the ACTUAL backend response structure
interface RawBackendResponse {
  data: {
    last_synced: string;
    metrics: {
      post_freq: number;
      top_platform: string;
      total_engagement: number;
      total_impressions: number;
    };
    pulse_data: Array<{
      Date: string;
      Engagement: number;
      Impressions: number;
      Platform: string;
    }>;
    recent_feed: Array<{
      comments: number;
      date: string;
      engagement: number;
      engagementRate: number;
      grade: string;
      impressions: number;
      likes: number;
      platform: string;
      shares: number;
      snippet: string;
      viralityScore: number;
    }>;
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  // Hard-wire to 127.0.0.1 IPv4 to avoid localhost resolution issues
  const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

  console.log("🔌 Attempting handshake with: " + apiUrl + "/api/dashboard");

  try {
    const response = await fetch(`${apiUrl}/api/dashboard`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const rawData = await response.json() as RawBackendResponse;
    console.log("📦 Raw Backend Payload:", rawData);

    // ADAPTER: Transform Backend Snake_Case -> Frontend CamelCase
    const backendMetrics = rawData.data.metrics;

    // Process Daily Stats (Pulse Data)
    const dailyStatsMap = new Map<string, DailyStat>();

    rawData.data.pulse_data.forEach(item => {
      const date = item.Date; // e.g., "2025-12-23"
      // Format date to "Jan 4" style if needed, or leave as YYYY-MM-DD
      // For now, simple mapping

      if (!dailyStatsMap.has(date)) {
        dailyStatsMap.set(date, { date, twitter: 0, linkedin: 0, youtube: 0 });
      }

      const stat = dailyStatsMap.get(date)!;
      // Using Impressions for the chart? Or Engagement? chart uses 'value' generic usually
      // The frontend AttentionChart likely expects numbers.

      if (item.Platform === 'Twitter') stat.twitter += item.Impressions;
      if (item.Platform === 'LinkedIn') stat.linkedin += item.Impressions;
      if (item.Platform === 'YouTube') stat.youtube += item.Impressions;
    });

    const adaptedDailyStats = Array.from(dailyStatsMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const adaptedData: DashboardData = {
      // Map recent_feed to posts
      posts: rawData.data.recent_feed.map((item, index) => {
        // Map backend string platform to Enum
        let platformEnum = Platform.TWITTER;
        if (item.platform.toLowerCase() === 'linkedin') platformEnum = Platform.LINKEDIN;
        if (item.platform.toLowerCase() === 'youtube') platformEnum = Platform.YOUTUBE;

        return {
          id: `post-${index}`,
          platform: platformEnum,
          snippet: item.snippet.substring(0, 50) + "...", // Create short snippet from full content
          fullContent: item.snippet,
          author: "Vedant",
          date: "2d", // Relative time placeholder
          topic: "Tech", // Default topic as backend doesn't provide per-post topic yet
          likes: item.likes,
          comments: item.comments,
          shares: item.shares,
          impressions: item.impressions,
          engagementRate: item.engagementRate,
          viralityScore: item.viralityScore,
          grade: item.grade as 'S' | 'A' | 'B' | 'C' | 'D',
          url: "#", // No URL provided by backend
          views: item.impressions, // Map views to impressions if needed by UI using 'views'
          engagement: item.engagement
        } as ContentItem; // Cast to ensure compatibility if extra fields are present/missing
      }),
      topics: [], // Backend key 'topics' exists but different structure, leaving empty for now to focus on posts
      dailyStats: adaptedDailyStats,
      metrics: {
        totalPosts: backendMetrics.post_freq,
        totalEngagements: backendMetrics.total_engagement,
        totalLikes: backendMetrics.total_impressions, // Using impressions as proxy for "likes" or wide reach for now
        totalComments: 0, // Not provided by backend
        postsGrowth: "0%", // Placeholder
        engagementsGrowth: "0%", // Placeholder
        avgPostsPerWeek: Math.round(backendMetrics.post_freq / 4), // Approx
        efficiency: "HIGH" // Placeholder
      },
      lastSynced: rawData.data.last_synced
    };

    console.log("✨ Adapted Frontend Data:", adaptedData);
    return adaptedData;

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
