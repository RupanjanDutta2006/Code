import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { Navbar } from './components/Navbar';
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <OfflineProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-dark-950 text-dark-100 selection:bg-brand-500 selection:text-white">
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
                <Route path="/classrooms" element={<ClassroomListPage />} />
                <Route path="/classrooms/:id" element={<ClassroomDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-dark-800/80 bg-dark-900/60 py-6 px-4 text-center text-xs text-dark-400">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-white">CodeVault Pro</span> — Empowering students & teachers with modern code tooling.
                </div>
                <div className="flex items-center gap-4 text-dark-400">
                  <a href="/about" className="hover:text-white transition-colors">Documentation</a>
                  <span>•</span>
                  <span>11 Compilers & Sandboxes</span>
                  <span>•</span>
                  <span>Real-time WebSockets</span>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </OfflineProvider>
    </AuthProvider>
  );
};

export default App;
