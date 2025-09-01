
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { Separator } from '@/components/ui/separator';

interface AuthPageProps {
  initialTab?: 'login' | 'register';
}

const AuthPage = ({ initialTab = 'login' }: AuthPageProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        <Tabs 
          defaultValue={initialTab} 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
