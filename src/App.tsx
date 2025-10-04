
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileOptimizedLayout } from "@/components/mobile/MobileOptimizedLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import CreateProductPage from "./pages/CreateProductPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import ConversationPage from "./pages/ConversationPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiePage from "./pages/CookiePage";
import SafetyPage from "./pages/SafetyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import SavedSearchesPage from "./pages/SavedSearchesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import SecurityPage from "./pages/SecurityPage";
import AdminUsersPage from "./pages/AdminUsersPage";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <MobileOptimizedLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/business" element={<BusinessDashboardPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/conversation/:id" element={<ConversationPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route path="/saved-searches" element={<SavedSearchesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/search" element={<AdvancedSearchPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileOptimizedLayout>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
