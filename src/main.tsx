
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { App as CapacitorApp } from '@capacitor/app'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

// Handle OAuth deep link back into the app (Capacitor)
if ((window as any).Capacitor?.isNativePlatform?.()) {
  CapacitorApp.addListener('appUrlOpen', (data: { url: string }) => {
    try {
      const raw = data?.url || '';
      if (raw.startsWith('app.lovable.d3616aa2da414916957d8d8533d680a4://')) {
        const hashIndex = raw.indexOf('#');
        const hash = hashIndex !== -1 ? raw.substring(hashIndex) : '';
        // Route to web callback with the auth hash so Supabase can finish the session
        window.location.href = `${window.location.origin}/auth/callback${hash}`;
      }
    } catch (e) {
      console.warn('appUrlOpen handler error', e);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
