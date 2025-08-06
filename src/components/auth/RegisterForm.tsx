
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { validateEmail, validatePassword, validatePhone } from '@/utils/authUtils';
import { PhoneVerificationStep } from './PhoneVerificationStep';

const RegisterForm = () => {
  const [step, setStep] = useState<'register' | 'phone-verification'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ 
    name?: string; 
    email?: string; 
    phone?: string;
    password?: string; 
    confirmPassword?: string;
    terms?: string;
  }>({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.errors?.[0] || 'Please enter a valid phone number';
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    if (!agreeTerms) {
      errors.terms = "You must agree to the terms and conditions";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Register user first, then proceed to phone verification
    try {
      await register(name.trim(), email.trim(), password);
      setStep('phone-verification');
    } catch (error) {
      // Error is already handled by the register function
    }
  };

  const handlePhoneVerificationComplete = () => {
    navigate('/dashboard');
  };

  const handleBackToRegister = () => {
    setStep('register');
  };

  // Password strength indicator
  const getPasswordStrengthIndicator = () => {
    const validation = validatePassword(password);
    const checks = [
      { label: 'At least 8 characters', test: password.length >= 8 },
      { label: 'Contains uppercase letter', test: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', test: /[a-z]/.test(password) },
      { label: 'Contains number', test: /\d/.test(password) },
      { label: 'Contains special character', test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];

    return (
      <div className="space-y-1 mt-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {check.test ? (
              <Check size={12} className="text-green-500" />
            ) : (
              <X size={12} className="text-red-500" />
            )}
            <span className={check.test ? "text-green-600" : "text-red-600"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (step === 'phone-verification') {
    return (
      <PhoneVerificationStep
        phone={phone}
        onVerificationComplete={handlePhoneVerificationComplete}
        onBack={handleBackToRegister}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Enter your details to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name && e.target.value.trim().length >= 2) {
                  setFieldErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              required
              autoComplete="name"
              className={fieldErrors.name ? "border-red-500" : ""}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm">{fieldErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email && validateEmail(e.target.value)) {
                  setFieldErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              required
              autoComplete="email"
              className={fieldErrors.email ? "border-red-500" : ""}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (fieldErrors.phone && validatePhone(e.target.value).isValid) {
                  setFieldErrors(prev => ({ ...prev, phone: undefined }));
                }
              }}
              required
              autoComplete="tel"
              className={fieldErrors.phone ? "border-red-500" : ""}
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password && validatePassword(e.target.value).isValid) {
                    setFieldErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                required
                autoComplete="new-password"
                className={fieldErrors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password && getPasswordStrengthIndicator()}
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword && e.target.value === password) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                required
                autoComplete="new-password"
                className={fieldErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms} 
              onCheckedChange={(checked) => {
                setAgreeTerms(checked as boolean);
                if (fieldErrors.terms && checked) {
                  setFieldErrors(prev => ({ ...prev, terms: undefined }));
                }
              }}
              className="mt-1"
            />
            <div className="space-y-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-marketplace-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to terms page when created
                  }}
                >
                  terms of service
                </Button>{" "}
                and{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-marketplace-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to privacy page when created
                  }}
                >
                  privacy policy
                </Button>
              </label>
              {fieldErrors.terms && (
                <p className="text-red-500 text-sm">{fieldErrors.terms}</p>
              )}
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <Button type="submit" className="w-full bg-marketplace-primary hover:bg-opacity-90" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-marketplace-accent"
            onClick={() => navigate('/auth/login')}
          >
            Login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
