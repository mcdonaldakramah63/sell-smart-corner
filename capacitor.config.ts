
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d3616aa2da414916957d8d8533d680a4',
  appName: 'Used Market',
  webDir: 'dist',
  server: {
    url: 'https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#2563eb',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    StatusBar: {
      backgroundColor: '#2563eb',
      style: 'light'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  // Add custom URL scheme so that the Android app can intercept the OAuth redirect and bring the user back to the app.
  // Make sure this matches the APP_SCHEME_REDIRECT above.
  // See: https://capacitorjs.com/docs/guides/deep-links
  /**
   * You will also need to add an <intent-filter> to your AndroidManifest.xml if you customize this.
   * For now, this ensures Capacitor/Android is aware of the scheme.
   */
  cordova: {
    preferences: {
      "AndroidScheme": "app.lovable.d3616aa2da414916957d8d8533d680a4"
    }
  }
};

export default config;
