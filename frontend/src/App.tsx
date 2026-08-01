import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { AIChatProvider } from './contexts/AIChatContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipToContent } from './components/SkipToContent';
import { FocusVisibleStyles } from './components/FocusVisibleStyles';
import { BackToTop } from './components/BackToTop';
import { ContextualHelp } from './components/ContextualHelp';
import { FloatingChatButton } from './components/FloatingChatButton';
import { AIChatModal } from './components/AIChatModal';
function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <AuthProvider>
          <OnboardingProvider>
            <AIChatProvider>
              <BackgroundProvider>
                  {/* Global Accessibility Features */}
                  <SkipToContent />
                  <FocusVisibleStyles />

                  {/* Main App Router */}
                  <div id="main-content">
                    <AppRouter />
                  </div>

                  {/* Global UI Elements */}
                  <FloatingChatButton />
                  <AIChatModal />
                  <BackToTop />
                  <ContextualHelp />

                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: 'rgba(26, 41, 66, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        color: 'white'
                      }
                    }} />

              </BackgroundProvider>
            </AIChatProvider>
          </OnboardingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>);

}
export { App };