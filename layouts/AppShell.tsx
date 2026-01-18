import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Message, ChatSession, ModelType } from '../types';
import { mockChatHistory } from '../data/mockChatHistory';
import { mockDevChat } from '../data/mockDevChat';
import { mockDesignChat } from '../data/mockDesignChat';
import { SettingsSection } from '../components/SettingsModal';
import { Sidebar } from '../components/Sidebar';
import { PricingModal } from '../components/PricingModal';
import { SearchOverlay } from '../components/SearchOverlay';
import { ShareModal } from '../components/ShareModal';
import { SettingsModal } from '../components/SettingsModal';
import { GroupChatModal, GroupLinkModal } from '../components/GroupModals';

export const AppShell: React.FC = () => {
    // --- Lifted State from App.tsx ---
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [tempSession, setTempSession] = useState<ChatSession | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH);

    // Modals
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsSection, setSettingsSection] = useState<SettingsSection>('appearance');
    const [isGroupInitModalOpen, setIsGroupInitModalOpen] = useState(false);
    const [isGroupLinkModalOpen, setIsGroupLinkModalOpen] = useState(false);

    // Theme
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [accentColor, setAccentColor] = useState('#b33a72');

    // Input State
    const [inputValue, setInputValue] = useState('');

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- Effects ---
    useEffect(() => {
        const saved = localStorage.getItem('helixar_sessions');
        const savedTheme = localStorage.getItem('helixar_theme') as 'dark' | 'light';
        const savedAccent = localStorage.getItem('helixar_accent');

        if (savedTheme) setTheme(savedTheme);
        if (savedAccent) setAccentColor(savedAccent);

        if (saved) {
            const parsed = JSON.parse(saved);

            // Inject Mock Sessions
            const mockId = 'mock-validation-sprint';
            const devMockId = 'mock-dev-architect';
            const designMockId = 'mock-ui-design';

            let newSessions: ChatSession[] = [...parsed];

            if (!newSessions.find((s: ChatSession) => s.id === mockId)) {
                newSessions.unshift({
                    id: mockId,
                    title: 'Validation Sprint',
                    messages: mockChatHistory,
                    updatedAt: 1705290045000,
                    isGroup: false
                });
            }

            if (!newSessions.find((s: ChatSession) => s.id === devMockId)) {
                newSessions.unshift({
                    id: devMockId,
                    title: 'Full Stack Arch',
                    messages: mockDevChat,
                    updatedAt: 1705300090000,
                    isGroup: false
                });
            }

            if (!newSessions.find((s: ChatSession) => s.id === designMockId)) {
                newSessions.unshift({
                    id: designMockId,
                    title: 'Neon UI Concept',
                    messages: mockDesignChat,
                    updatedAt: 1705310090000,
                    isGroup: false
                });
            }

            setSessions(newSessions);
            if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
            else createNewSession();
        } else {
            // Create with mock sessions
            const mockSessions = [
                {
                    id: 'mock-ui-design',
                    title: 'Neon UI Concept',
                    messages: mockDesignChat,
                    updatedAt: 1705310090000,
                    isGroup: false
                },
                {
                    id: 'mock-dev-architect',
                    title: 'Full Stack Arch',
                    messages: mockDevChat,
                    updatedAt: 1705300090000,
                    isGroup: false
                },
                {
                    id: 'mock-validation-sprint',
                    title: 'Validation Sprint',
                    messages: mockChatHistory,
                    updatedAt: 1705290045000,
                    isGroup: false
                }
            ];

            setSessions(mockSessions);
            setCurrentSessionId(mockSessions[0].id);
        }
    }, []);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('helixar_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    useEffect(() => {
        document.body.className = theme === 'light' ? 'theme-light' : '';
        localStorage.setItem('helixar_theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', accentColor);
        localStorage.setItem('helixar_accent', accentColor);
    }, [accentColor]);

    // --- Handlers ---
    const currentSession = currentSessionId === tempSession?.id ? tempSession : sessions.find(s => s.id === currentSessionId);

    const createNewSession = useCallback(() => {
        if (currentSessionId === tempSession?.id && tempSession?.messages.length === 0) return;

        const newSession: ChatSession = {
            id: Math.random().toString(36).substring(7),
            title: 'New chat',
            messages: [],
            updatedAt: Date.now(),
            isGroup: false
        };

        setTempSession(newSession);
        setCurrentSessionId(newSession.id);
    }, [currentSessionId, tempSession]);

    const deleteSession = (id: string) => {
        if (id === tempSession?.id) {
            setTempSession(null);
            setCurrentSessionId(sessions.length > 0 ? sessions[0].id : null);
            if (sessions.length === 0) setTimeout(createNewSession, 0);
            return;
        }

        setSessions(prev => {
            const filtered = prev.filter(s => s.id !== id);
            if (currentSessionId === id) {
                setCurrentSessionId(filtered.length > 0 ? filtered[0].id : null);
                if (filtered.length === 0) setTimeout(createNewSession, 0);
            }
            return filtered;
        });
    };

    const renameSession = (id: string, newTitle: string) => {
        if (id === tempSession?.id) {
            setTempSession(prev => prev ? { ...prev, title: newTitle } : null);
        } else {
            setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
        }
    };

    const triggerModelResponse = async (promptText: string) => {
        if (!currentSessionId) return;
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: selectedModel,
                contents: promptText,
                config: { systemInstruction: "You are Helixar, a professional AI creative workspace. Provide concise, helpful answers." }
            });

            const aiMsg: Message = {
                id: Math.random().toString(36).substring(7),
                role: 'assistant',
                content: response.text || "I'm sorry, I couldn't generate a response.",
                timestamp: Date.now()
            };

            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, messages: [...s.messages, aiMsg] };
                }
                return s;
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !currentSessionId) return;

        const userMsg: Message = {
            id: Math.random().toString(36).substring(7),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };

        if (currentSessionId === tempSession?.id) {
            const promotedSession = {
                ...tempSession,
                title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
                messages: [userMsg],
                updatedAt: Date.now()
            };

            setSessions(prev => [promotedSession, ...prev]);
            setTempSession(null);
        } else {
            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                    const newTitle = s.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : s.title;
                    return {
                        ...s,
                        title: newTitle,
                        messages: [...s.messages, userMsg],
                        updatedAt: Date.now()
                    };
                }
                return s;
            }));
        }

        await triggerModelResponse(text);
    };

    const openSearch = () => setIsSearchOpen(true);

    const openSettings = (section: SettingsSection) => {
        setSettingsSection(section);
        setIsSettingsOpen(true);
    };

    // Context to pass to child routes via Outlet
    const outletContext = {
        sessions,
        currentSessionId,
        currentSession,
        tempSession,
        onDeleteSession: deleteSession,
        onRenameSession: renameSession,
        onCreateNewSession: createNewSession,
        onSelectSession: setCurrentSessionId,
        onSendMessage: handleSendMessage,
        isTyping,
        selectedModel,
        setSelectedModel,
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        inputValue,
        setInputValue,
        onUpgrade: () => setIsPricingOpen(true),
        onOpenSearch: openSearch,
        onOpenSettings: openSettings
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-black text-gray-200 selection:bg-white/20">
            {/* Global Modals */}
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} session={currentSession} />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                initialSection={settingsSection}
                theme={theme}
                setTheme={setTheme}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
            />
            <GroupChatModal isOpen={isGroupInitModalOpen} onClose={() => setIsGroupInitModalOpen(false)} onConfirm={() => { }} theme={theme} />
            <GroupLinkModal isOpen={isGroupLinkModalOpen} onClose={() => setIsGroupLinkModalOpen(false)} link={currentSession?.groupLink || ""} theme={theme} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} sessions={sessions} onSelectChat={(id) => { setCurrentSessionId(id); setIsSearchOpen(false); }} />

            {/* Persistent Sidebar */}
            <aside className={`
        relative h-full transition-all duration-300 ease-in-out shrink-0 border-r border-[#1a1a1a]
        ${isSidebarOpen ? 'w-[260px]' : 'w-[68px]'}
      `}>
                <Sidebar
                    sessions={sessions}
                    currentId={currentSessionId}
                    onSelect={setCurrentSessionId}
                    onDelete={deleteSession}
                    onRename={renameSession}
                    onNewChat={createNewSession}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    model={selectedModel}
                    setModel={setSelectedModel}
                    onUpgrade={() => setIsPricingOpen(true)}
                    onOpenSearch={openSearch}
                    onOpenSettings={openSettings}
                    onOpenGroupLink={() => setIsGroupLinkModalOpen(true)}
                    theme={theme}
                    isCollapsed={!isSidebarOpen}
                />
            </aside>

            {/* Main Content Area - React Router Outlet */}
            <main className="flex-1 overflow-hidden">
                <Outlet context={outletContext} />
            </main>
        </div>
    );
};
