// Dashboard Types
// Extracted from main types.ts for migration

export enum Platform {
    LINKEDIN = 'LinkedIn',
    TWITTER = 'Twitter',
    YOUTUBE = 'YouTube'
}

export interface ContentItem {
    id: string;
    platform: Platform;
    snippet: string;
    fullContent: string;
    date: string;
    topic: string;
    likes: number;
    comments: number;
    impressions: number;
    engagementRate: number;
    viralityScore: number; // 0-100
    grade: 'S' | 'A' | 'B' | 'C' | 'D';
    url: string;
}

export interface DailyStat {
    date: string;
    twitter: number;
    linkedin: number;
    youtube: number;
}

export interface Topic {
    name: string;
    score: number; // 0-100 impact
    volume: number; // Size of bubble
    sentiment: 'positive' | 'neutral' | 'negative';
}

export interface TopicSummary {
    name: string;
    count: number;
    avgVirality: number;
    performance: 'High' | 'Standard';
}

export interface ConnectionStatus {
    platform: Platform;
    connected: boolean;
    lastSynced?: string;
}

export interface Alert {
    id: string;
    type: 'trend' | 'competitor' | 'system';
    message: string;
    timestamp: string;
}
