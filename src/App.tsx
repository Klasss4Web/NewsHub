import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { ErrorBoundary } from '@/components/common'
import { HomePage } from '@/pages/HomePage'
import { PreferencesPage } from '@/pages/PreferencesPage'
import { ArticleDetailPage } from '@/pages/ArticleDetailPage'
import { PreferencesProvider } from '@/stores/preferenceStore'
import { ThemeProvider } from '@/stores/themeStore'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PreferencesProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="article/:id" element={<ArticleDetailPage />} />
                <Route path="preferences" element={<PreferencesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PreferencesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
