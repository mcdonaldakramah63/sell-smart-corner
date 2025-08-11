import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Basic i18n setup with common UI strings. Extend as needed.
const resources = {
  en: {
    common: {
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      settings: 'Settings',
      help: 'Help',
    },
  },
  es: {
    common: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      profile: 'Perfil',
      settings: 'Configuración',
      help: 'Ayuda',
    },
  },
  fr: {
    common: {
      login: 'Connexion',
      register: "S'inscrire",
      profile: 'Profil',
      settings: 'Paramètres',
      help: 'Aide',
    },
  },
  de: {
    common: {
      login: 'Anmelden',
      register: 'Registrieren',
      profile: 'Profil',
      settings: 'Einstellungen',
      help: 'Hilfe',
    },
  },
};

void i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // Namespaces default to translation, we use 'common'
    defaultNS: 'common',
  });

export default i18n;
