import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIChatProvider } from './context/AIChatContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CodeVaultAIChat } from './components/CodeVaultAIChat';
import { OnboardingModal } from './components/OnboardingModal';
import { AnimatedRedBlackBackground } from './components/AnimatedRedBlackBackground';
import { CodeVaultStartupShell } from './components/CodeVaultStartupShell';
import { forceUnlockBodyScroll } from './hooks/useBodyScrollLock';
import { ErrorBoundary } from './components/ErrorBoundary';

// Immediate home page for instant first paint
import { HomePage } from './pages/HomePage';

// Route-level code splitting with React.lazy
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then(m => ({ default: m.ProgramDetailPage })));
const MyProgramsPage = lazy(() => import('./pages/MyProgramsPage').then(m => ({ default: m.MyProgramsPage })));
const ImportPage = lazy(() => import('./pages/ImportPage').then(m => ({ default: m.ImportPage })));
const CreateProgramPage = lazy(() => import('./pages/CreateProgramPage').then(m => ({ default: m.CreateProgramPage })));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage').then(m => ({ default: m.PlaygroundPage })));
const ClassroomListPage = lazy(() => import('./pages/ClassroomListPage').then(m => ({ default: m.ClassroomListPage })));
const ClassroomDetailPage = lazy(() => import('./pages/ClassroomDetailPage').then(m => ({ default: m.ClassroomDetailPage })));
const MyClassPage = lazy(() => import('./pages/MyClassPage').then(m => ({ default: m.MyClassPage })));
const InteractiveClassPage = lazy(() => import('./pages/InteractiveClassPage').then(m => ({ default: m.InteractiveClassPage })));
const UserActivityPage = lazy(() => import('./pages/UserActivityPage').then(m => ({ default: m.UserActivityPage })));
const AdminActivityDashboardPage = lazy(() => import('./pages/AdminActivityDashboardPage').then(m => ({ default: m.AdminActivityDashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const CreatorPage = lazy(() => import('./pages/CreatorPage').then(m => ({ default: m.CreatorPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const DeveloperGitHubConnectPage = lazy(() => import('./pages/DeveloperGitHubConnectPage').then(m => ({ default: m.DeveloperGitHubConnectPage })));

/**
 * Route change listener: cleans up any dangling scroll locks on navigation
 * and positions the viewport seamlessly.
 */
const NavigationScrollManager: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    forceUnlockBodyScroll();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <OfflineProvider>
            <AIChatProvider>
              <BrowserRouter>
                <NavigationScrollManager />
                <div className="min-h-screen-dvh flex flex-col bg-light-bg dark:bg-[#060608] text-slate-800 dark:text-dark-200 selection:bg-crimson-500 selection:text-white transition-colors duration-200 relative pb-16 md:pb-0">
                  {/* Ambient Red-Black Background System (Fixed at viewport level) */}
                  <AnimatedRedBlackBackground />

                  {/* Header: z-40 in global hierarchy */}
                  <Navbar />
                  
                  {/* Main content: z-10 in global hierarchy */}
                  <main className="flex-1 overflow-x-hidden relative z-10">
                    <Suspense fallback={<CodeVaultStartupShell message="Loading page..." />}>
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
                        <Route path="/my-activity" element={<UserActivityPage />} />
                        <Route path="/activity" element={<UserActivityPage />} />
                        <Route path="/admin/activity" element={<AdminActivityDashboardPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/creator" element={<CreatorPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/developer/github-connect" element={<DeveloperGitHubConnectPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </main>

                  {/* Mobile Bottom Navigation Bar: z-50 in global hierarchy */}
                  <MobileBottomNav />

                  {/* Global Unified CodeVault AI Chat Drawer: z-[900] */}
                  <CodeVaultAIChat />

                  {/* First-time User Profile Onboarding Modal */}
                  <OnboardingModal />

                  {/* Footer: z-10 in normal document flow */}
                  <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#08080c]/80 py-8 px-4 text-center text-xs text-slate-500 dark:text-dark-400 backdrop-blur-xl transition-colors duration-200 mb-14 md:mb-0 relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">CodeVault Pro</span> — Next-Gen AI Code Platform & Interactive Learning Studio.
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 dark:text-dark-400">
                        <Link to="/about" className="hover:text-crimson-400 transition-colors">Documentation</Link>
                        <span>•</span>
                        <Link to="/creator" className="hover:text-crimson-400 transition-colors font-medium">Creator</Link>
                        <span>•</span>
                        <Link to="/contact" className="hover:text-crimson-400 transition-colors font-medium">Contact & Team</Link>
                        <span>•</span>
                        <Link to="/developer/github-connect" className="hover:text-crimson-400 transition-colors font-mono text-[11px] text-dark-500">GitHub Connect</Link>
                      </div>
                    </div>
                  </footer>
                </div>
              </BrowserRouter>
            </AIChatProvider>
          </OfflineProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;