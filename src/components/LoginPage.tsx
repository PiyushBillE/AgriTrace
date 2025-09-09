import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Sprout, Mail, Lock, QrCode, ArrowRight, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: string) => void;
  onConsumerAccess: () => void;
  onBack?: () => void;
}

export function LoginPage({ onLogin, onConsumerAccess, onBack }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual authentication API call
      // For now, simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determine role based on email domain or use default
      let role = 'farmer';
      if (formData.email.includes('distributor')) role = 'distributor';
      else if (formData.email.includes('retailer')) role = 'retailer';
      else if (formData.email.includes('admin')) role = 'admin';
      
      onLogin(role);
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-green-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-blue-300 rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-orange-300 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 border-2 border-purple-300 rounded-lg rotate-12"></div>
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AgriTrace</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            <QrCode className="h-4 w-4 mr-1" />
            Transparent • Traceable • Trustworthy
          </Badge>
        </div>

        {/* Main Login Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between">
              {onBack && (
                <Button variant="ghost" onClick={onBack} size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-lg mt-1">
                  Sign in to access your dashboard
                </CardDescription>
              </div>
              <div className="w-20"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full text-lg py-3"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
              </Button>
            </form>

            {/* Consumer Access */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue as
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={onConsumerAccess}
              className="w-full flex items-center gap-2"
              disabled={isLoading}
            >
              <User className="h-4 w-4" />
              Consumer - Scan QR Codes
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an account? Contact your organization administrator.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Secure blockchain-powered agricultural supply chain tracking</p>
        </div>
      </div>
    </div>
  );
}