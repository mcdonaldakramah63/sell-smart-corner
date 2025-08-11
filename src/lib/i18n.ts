import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Basic i18n setup with common UI strings. Extend as needed.
const resources = {
  en: { common: { login: 'Login', register: 'Register', profile: 'Profile', settings: 'Settings', help: 'Help', myAccount: 'My Account', logout: 'Logout' } },
  es: { common: { login: 'Iniciar sesión', register: 'Registrarse', profile: 'Perfil', settings: 'Configuración', help: 'Ayuda', myAccount: 'Mi cuenta', logout: 'Cerrar sesión' } },
  fr: { common: { login: 'Connexion', register: "S'inscrire", profile: 'Profil', settings: 'Paramètres', help: 'Aide', myAccount: 'Mon compte', logout: 'Déconnexion' } },
  de: { common: { login: 'Anmelden', register: 'Registrieren', profile: 'Profil', settings: 'Einstellungen', help: 'Hilfe', myAccount: 'Mein Konto', logout: 'Abmelden' } },
  it: { common: { login: 'Accesso', register: 'Registrati', profile: 'Profilo', settings: 'Impostazioni', help: 'Aiuto', myAccount: 'Il mio account', logout: 'Esci' } },
  pt: { common: { login: 'Entrar', register: 'Cadastrar', profile: 'Perfil', settings: 'Configurações', help: 'Ajuda', myAccount: 'Minha conta', logout: 'Sair' } },
  ar: { common: { login: 'تسجيل الدخول', register: 'إنشاء حساب', profile: 'الملف الشخصي', settings: 'الإعدادات', help: 'مساعدة', myAccount: 'حسابي', logout: 'تسجيل الخروج' } },
  zh: { common: { login: '登录', register: '注册', profile: '个人资料', settings: '设置', help: '帮助', myAccount: '我的账户', logout: '退出登录' } },
  ja: { common: { login: 'ログイン', register: '登録', profile: 'プロフィール', settings: '設定', help: 'ヘルプ', myAccount: 'マイアカウント', logout: 'ログアウト' } },
  tw: { common: { login: 'Hyɛ mu', register: 'Kyerɛw wo din', profile: 'Nkonimdi krataa', settings: 'Nhyehyɛeɛ', help: 'Mmoa', myAccount: 'Me akawnt', logout: 'Fi mu' } },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  defaultNS: 'common',
});

export default i18n;
