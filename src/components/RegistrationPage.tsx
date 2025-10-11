import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sprout, ArrowLeft, User, Mail, Lock, MapPin, Phone, Building, ArrowRight, Tractor, Truck, Store, Shield } from 'lucide-react';

interface RegistrationPageProps {
  onRegister: (userData: any) => void;
  onBack: () => void;
}

export function RegistrationPage({ onRegister, onBack }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organization: '',
    phone: '',
    address: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    {
      id: 'farmer',
      label: 'Farmer',
      icon: Tractor,
      description: 'Register crops, manage batches, track expenses',
      color: 'text-green-600'
    },
    {
      id: 'distributor',
      label: 'Distributor',
      icon: Truck,
      description: 'Accept transfers, manage logistics, quality control',
      color: 'text-blue-600'
    },
    {
      id: 'retailer',
      label: 'Retailer',
      icon: Store,
      description: 'Set prices, manage inventory, serve consumers',
      color: 'text-purple-600'
    }
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization/Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send data to backend
      onRegister({
        ...formData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
      });
    }
  };

  const selectedRole = roles.find(role => role.id === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sprout className="h-12 w-12 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">AgriTrace</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          Registration • Blockchain Supply Chain
        </Badge>
      </div>

      {/* Registration Form */}
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription className="text-lg mt-1">
                Join the AgriTrace network
              </CardDescription>
            </div>
            <div className="w-20"></div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Role & Organization</h3>
              
              <div>
                <Label htmlFor="role">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role in the supply chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${role.color}`} />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedRole.description}</p>
                )}
                {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Organization/Company *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Your company name"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.organization && <p className="text-sm text-destructive mt-1">{errors.organization}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    placeholder="Enter your business address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Brief Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your business and how you plan to use AgriTrace"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                Create Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>By creating an account, you agree to AgriTrace's terms of service</p>
        <p className="mt-1">All data is secured using blockchain technology</p>
      </div>
    </div>
  );
}