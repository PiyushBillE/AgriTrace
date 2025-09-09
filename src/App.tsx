import React, { useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Sprout, Truck, Store, User, QrCode, Shield, Tractor, LogOut } from 'lucide-react';
import { WelcomePage } from './components/WelcomePage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { DistributorDashboard } from './components/DistributorDashboard';
import { RetailerDashboard } from './components/RetailerDashboard';
import { ConsumerPage } from './components/ConsumerPage';
import { AdminDashboard } from './components/AdminDashboard';

type AppState = 'welcome' | 'login' | 'register' | 'authenticated' | 'consumer';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const handleWelcomeLogin = () => {
    setAppState('login');
  };

  const handleWelcomeRegister = () => {
    setAppState('register');
  };

  const handleWelcomeConsumer = () => {
    setAppState('consumer');
  };

  const handleLogin = (role: string, loginData?: any) => {
    setActiveRole(role);
    if (loginData) {
      setUserData(loginData);
    }
    setAppState('authenticated');
  };

  const handleRegister = (newUserData: any) => {
    setUserData(newUserData);
    setActiveRole(newUserData.role);
    setAppState('authenticated');
  };

  const handleBackToWelcome = () => {
    setAppState('welcome');
    setActiveRole(null);
    setUserData(null);
  };

  const handleLogout = () => {
    setAppState('welcome');
    setActiveRole(null);
    setUserData(null);
  };

  const getRoleInfo = (role: string) => {
    const roleMap = {
      farmer: { label: 'Farmer', icon: Tractor, color: 'text-green-600' },
      distributor: { label: 'Distributor', icon: Truck, color: 'text-blue-600' },
      retailer: { label: 'Retailer', icon: Store, color: 'text-purple-600' },
      admin: { label: 'System Admin', icon: Shield, color: 'text-red-600' }
    };
    return roleMap[role as keyof typeof roleMap];
  };

  const renderDashboard = () => {
    if (!activeRole) return null;
    
    switch (activeRole) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      case 'retailer':
        return <RetailerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  // Show welcome page
  if (appState === 'welcome') {
    return (
      <WelcomePage
        onLogin={handleWelcomeLogin}
        onRegister={handleWelcomeRegister}
        onConsumerAccess={handleWelcomeConsumer}
      />
    );
  }

  // Show login page
  if (appState === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onConsumerAccess={handleWelcomeConsumer}
        onBack={handleBackToWelcome}
      />
    );
  }

  // Show registration page
  if (appState === 'register') {
    return (
      <RegistrationPage
        onRegister={handleRegister}
        onBack={handleBackToWelcome}
      />
    );
  }

  // Show consumer page
  if (appState === 'consumer') {
    return (
      <div className="min-h-screen bg-background">
        {/* Consumer Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sprout className="h-8 w-8 text-green-600" />
                  <h1 className="text-2xl font-bold">AgriTrace</h1>
                </div>
                <Badge variant="outline" className="ml-4">
                  <QrCode className="h-3 w-3 mr-1" />
                  Consumer Scanner
                </Badge>
              </div>
              
              <Button variant="outline" onClick={handleBackToWelcome}>
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <ConsumerPage />
        </main>

        <footer className="border-t bg-muted/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>AgriTrace - Verify the authenticity and journey of your food products</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Main authenticated dashboard
  const roleInfo = activeRole ? getRoleInfo(activeRole) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold">AgriTrace</h1>
              </div>
              <Badge variant="outline" className="ml-4">
                <QrCode className="h-3 w-3 mr-1" />
                Blockchain-Powered Supply Chain
              </Badge>
            </div>
            
            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              {roleInfo && (
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                  <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                  <span className="text-sm font-medium">{roleInfo.label}</span>
                </div>
              )}
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderDashboard()}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>AgriTrace - Transparent, Traceable, Trustworthy Agricultural Supply Chain</p>
            <p className="mt-1">Built for hackathon demo - Blockchain integration simulated</p>
          </div>
        </div>
      </footer>
    </div>
  );
}