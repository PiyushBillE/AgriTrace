import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sprout, Tractor, Truck, Store, Shield, QrCode, ArrowRight, User, UserPlus, LogIn } from 'lucide-react';

interface WelcomePageProps {
  onLogin: () => void;
  onRegister: () => void;
  onConsumerAccess: () => void;
}

export function WelcomePage({ onLogin, onRegister, onConsumerAccess }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-green-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-blue-300 rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-orange-300 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 border-2 border-purple-300 rounded-lg rotate-12"></div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-green-100 rounded-full">
            <Sprout className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AgriTrace</h1>
        </div>
        <p className="text-xl text-gray-700 max-w-2xl">
          Blockchain-powered agricultural supply chain tracking system
        </p>
        <Badge variant="outline" className="text-sm">
          <QrCode className="h-4 w-4 mr-1" />
          Transparent • Traceable • Trustworthy
        </Badge>
      </div>

      {/* Features Overview */}
      <div className="mb-6 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Tractor className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold">Farm Origin</h3>
            <p className="text-sm text-gray-600">Track from seed to harvest</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold">Distribution</h3>
            <p className="text-sm text-gray-600">Monitor transportation</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Store className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold">Retail</h3>
            <p className="text-sm text-gray-600">Shelf to consumer</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold">Verification</h3>
            <p className="text-sm text-gray-600">Immutable records</p>
          </div>
        </div>
      </div>

      {/* Main Welcome Card */}
      <Card className="w-full max-w-2xl shadow-2xl mx-4">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl">Get Started</CardTitle>
          <CardDescription className="text-lg">
            Choose how you'd like to access AgriTrace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login/Register Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Login Option */}
            <Card 
              className="cursor-pointer border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:border-blue-400"
              onClick={onLogin}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <LogIn className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sign In</h3>
                    <p className="text-sm text-blue-700">Existing users</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Access your dashboard and manage your agricultural supply chain data
                </p>
                <div className="flex items-center justify-center text-blue-600">
                  <span className="text-sm font-medium">Continue</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            {/* Register Option */}
            <Card 
              className="cursor-pointer border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 transition-all duration-200 hover:border-green-400"
              onClick={onRegister}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserPlus className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Register</h3>
                    <p className="text-sm text-green-700">New users</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Create your account and join the transparent agricultural ecosystem
                </p>
                <div className="flex items-center justify-center text-green-600">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>

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

          <Card 
            className="cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 transition-all duration-200 hover:border-purple-400"
            onClick={onConsumerAccess}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <QrCode className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Consumer Access</h3>
                  <p className="text-sm text-purple-700">Scan & Verify Products</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan QR codes on products to verify authenticity and trace their journey from farm to table
              </p>
              <div className="flex items-center justify-center text-purple-600">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Start Scanning</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-center">Who can use AgriTrace?</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Tractor className="h-4 w-4 text-green-600" />
                <span>Farmers</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Distributors</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-purple-600" />
                <span>Retailers</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-600" />
                <span>Consumers</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-2xl">
        <p>AgriTrace creates an immutable digital record of produce from farm to consumer using blockchain technology, ensuring complete transparency and traceability in the agricultural supply chain.</p>
      </div>
    </div>
  );
}