import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Message, ChatSession, ModelType } from './types';
import { mockChatHistory } from './data/mockChatHistory';
import { mockDevChat } from './data/mockDevChat';
import { mockDesignChat } from './data/mockDesignChat';
import { SettingsSection } from './components/SettingsModal';
import { useIsMobile } from './hooks/useIsMobile';
import { AppShell } from './layouts/AppShell';
import { MobileShell } from './layouts/MobileShell';
import { ChatPage } from './pages/ChatPage';
import { MobileChatPage } from './pages/MobileChatPage';
import DeepDiveDashboard from './components/dashboard/DeepDiveDashboard';
import ErrorBoundary from './ErrorBoundary';

// Mobile-specific state management component
const MobileApp: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [tempSession, setTempSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [inputValue, setInputValue] = useState('');

  // Load sessions and theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('helixar_sessions');
    const savedTheme = localStorage.getItem('helixar_theme') as 'dark' | 'light';

    if (savedTheme) setTheme(savedTheme);

    const mockSessions = [
      { id: 'mock-ui-design', title: 'Neon UI Concept', messages: mockDesignChat, updatedAt: 1705310090000, isGroup: false },
      { id: 'mock-dev-architect', title: 'Full Stack Arch', messages: mockDevChat, updatedAt: 1705300090000, isGroup: false },
      { id: 'mock-validation-sprint', title: 'Validation Sprint', messages: mockChatHistory, updatedAt: 1705290045000, isGroup: false }
    ];

    if (saved) {
      const parsed = JSON.parse(saved);
      let newSessions: ChatSession[] = [...parsed];
      
      // Inject mock sessions if not present
      mockSessions.forEach(mock => {
        if (!newSessions.find(s => s.id === mock.id)) {
          newSessions.unshift(mock);
        }
      });
      
      setSessions(newSessions);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
      else createNewSession();
    } else {
      setSessions(mockSessions);
      setCurrentSessionId(mockSessions[0].id);
    }
  }, []);

  // Persist sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('helixar_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Apply theme changes
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
    localStorage.setItem('helixar_theme', theme);
  }, [theme]);

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

  const openSearch = () => { };
  const openSettings = (section: SettingsSection) => { };

  // Context for mobile routes
  const mobileContext = {
    currentSession,
    onSendMessage: handleSendMessage,
    isTyping,
    inputValue,
    setInputValue,
    theme
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={
          <MobileShell
            sessions={sessions}
            currentSessionId={currentSessionId}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
            onCreateNewSession={createNewSession}
            onSelectSession={setCurrentSessionId}
            theme={theme}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onUpgrade={() => { }}
            onOpenSearch={openSearch}
            onOpenSettings={openSettings}
            context={mobileContext}
          />
        }>
          <Route path="/" element={<MobileChatPage />} />
          <Route path="/dashboard" element={
            <div className="h-full overflow-y-auto p-4">
              <DeepDiveDashboard isDarkMode={true} />
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// Main App component with desktop/mobile split
const App: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ErrorBoundary>
        <MobileApp />
      </ErrorBoundary>
    );
  }

  // Desktop render with routing
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/dashboard" element={<DeepDiveDashboard isDarkMode={true} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;