import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIChatProvider } from './context/AIChatContext';
import { Navbar } from './components/Navbar';
import { CodeVaultAIChat } from './components/CodeVaultAIChat';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { MyProgramsPage } from './pages/MyProgramsPage';
import { ImportPage } from './pages/ImportPage';
import { CreateProgramPage } from './pages/CreateProgramPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ClassroomListPage } from './pages/ClassroomListPage';
import { ClassroomDetailPage } from './pages/ClassroomDetailPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { CreatorPage } from './pages/CreatorPage';
import { ContactPage } from './pages/ContactPage';
import { MyClassPage } from './pages/MyClassPage';
import { InteractiveClassPage } from './pages/InteractiveClassPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OfflineProvider>
          <AIChatProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-dark-200 selection:bg-neon-purple selection:text-white transition-colors duration-200 relative">
                <Navbar />
                
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/programs" element={<ProgramsPage />} />
                    <Route path="/programs/:id" element={<ProgramDetailPage />} />
                    <Route path="/my-programs" element={<MyProgramsPage />} />
                    <Route path="/import" element={<ImportPage />} />
                    <Route path="/create" element={<CreateProgramPage />} />
                    <Route path="/playground" element={<PlaygroundPage />} />
                    <Route path="/playground/:roomId" element={<PlaygroundPage />} />
                    <Route path="/my-class" element={<MyClassPage />} />
                    <Route path="/my-class/:slug" element={<InteractiveClassPage />} />
                    <Route path="/classrooms" element={<ClassroomListPage />} />
                    <Route path="/classrooms/:id" element={<ClassroomDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/creator" element={<CreatorPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Global Unified CodeVault AI Chat Trigger & Drawer */}
                <CodeVaultAIChat />

                {/* Footer */}
                <footer className="border-t border-slate-200/80 dark:border-[#1b223c] bg-white/70 dark:bg-dark-950/80 py-8 px-4 text-center text-xs text-slate-500 dark:text-dark-400 backdrop-blur-xl transition-colors duration-200">
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">CodeVault Pro</span> — Next-Gen AI Code Platform & Interactive Learning Studio.
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 dark:text-dark-400">
                      <a href="/about" className="hover:text-purple-400 transition-colors">Documentation</a>
                      <span>•</span>
                      <a href="/creator" className="hover:text-purple-400 transition-colors font-medium">Creator</a>
                      <span>•</span>
                      <a href="/contact" className="hover:text-cyan-400 transition-colors font-medium">Contact & Team</a>
                      <span>•</span>
                      <span>11 Compilers</span>
                    </div>
                  </div>
                </footer>
              </div>
            </BrowserRouter>
          </AIChatProvider>
        </OfflineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
