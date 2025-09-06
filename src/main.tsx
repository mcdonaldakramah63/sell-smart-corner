
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { App as CapacitorApp } from '@capacitor/app'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize Google Auth for Capacitor
if ((window as any).Capacitor?.isNativePlatform?.()) {
  GoogleAuth.initialize({
    clientId: '436443580127-vvl9gu1kr6mk6sqourmgneb0rvbfioci.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
}

// Handle OAuth deep link back into the app (Capacitor)
if ((window as any).Capacitor?.isNativePlatform?.()) {
  CapacitorApp.addListener('appUrlOpen', (data: { url: string }) => {
    try {
      console.log('Deep link received:', data.url);
      const raw = data?.url || '';
      
      if (raw.startsWith('app.lovable.d3616aa2da414916957d8d8533d680a4://')) {
        console.log('Processing OAuth deep link...');
        
        // Extract hash or query parameters from the deep link
        const url = new URL(raw.replace('app.lovable.d3616aa2da414916957d8d8533d680a4://', 'https://dummy.com/'));
        
        // Check for hash fragment (contains access_token, etc.)
        let hashParams = '';
        if (url.hash) {
          hashParams = url.hash;
        } else if (url.search) {
          // Convert query params to hash format for Supabase
          hashParams = '#' + url.search.substring(1);
        }
        
        console.log('Hash params:', hashParams);
        
        // Navigate to the auth callback page with the auth data
        if (hashParams) {
          window.location.href = `${window.location.origin}/auth/callback${hashParams}`;
        } else {
          // Fallback: just go to callback page
          window.location.href = `${window.location.origin}/auth/callback`;
        }
      }
    } catch (e) {
      console.error('appUrlOpen handler error', e);
      // Fallback navigation
      window.location.href = `${window.location.origin}/auth/callback`;
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
