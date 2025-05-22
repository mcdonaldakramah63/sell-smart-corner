
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (password !== confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    
    if (!agreeTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }
    
    await register(name, email, password);
  };

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
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms} 
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} 
            />
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
          </div>
          
          {(formError || error) && (
            <p className="text-red-500 text-sm">{formError || error}</p>
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
