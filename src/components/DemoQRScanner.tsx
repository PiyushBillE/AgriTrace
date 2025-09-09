import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { QrCode, Scan, Package, MapPin, Calendar, User, CheckCircle, Clock, Truck } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface DemoQRScannerProps {
  onScanResult?: (data: any) => void;
}

export function DemoQRScanner({ onScanResult }: DemoQRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo QR codes available for testing
  const demoQRCodes = [
    { id: 'DEMO001', label: 'Basmati Rice - In Transit', status: 'success' },
    { id: 'DEMO002', label: 'Organic Tomatoes - In Store', status: 'success' },
    { id: 'DEMO003', label: 'Wheat - Processing', status: 'warning' }
  ];

  const handleDemoScan = async (qrId: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch demo data from backend
      const response = await fetch(`https://demo.supabase.co/functions/v1/make-server-b9466d4b/demo/qr/${qrId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-key'
        }
      }).catch(() => {
        // Fallback to local demo data if API is not available
        return { ok: true, json: () => Promise.resolve({ success: true, data: getLocalDemoData(qrId) }) };
      });

      const result = await response.json();
      
      if (result.success) {
        setScannedData(result.data);
        if (onScanResult) {
          onScanResult(result.data);
        }
      } else {
        setError('QR code not found in demo database');
      }
    } catch (err) {
      console.error('Error scanning demo QR:', err);
      setError('Failed to scan QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) {
      setError('Please enter a QR code');
      return;
    }
    
    const qrId = manualInput.trim().toUpperCase();
    await handleDemoScan(qrId);
  };

  const getLocalDemoData = (qrId: string) => {
    const demoData = {
      'DEMO001': {
        id: 'BATCH-DEMO001',
        cropType: 'Basmati Rice',
        quantity: 1000,
        harvestDate: '2024-01-15',
        farmer: 'Demo Farmer - Rajesh Kumar',
        farmLocation: 'Punjab, India',
        certifications: ['Organic', 'Non-GMO'],
        currentOwner: 'Distributor',
        status: 'In Transit',
        qrCode: 'DEMO001',
        journey: [
          {
            stage: 'Farm',
            location: 'Punjab, India',
            date: '2024-01-15',
            person: 'Rajesh Kumar',
            details: 'Harvested from organic farm'
          },
          {
            stage: 'Distributor',
            location: 'Delhi Warehouse',
            date: '2024-01-18',
            person: 'Northern Distributors Ltd',
            details: 'Quality checked and stored at 4°C'
          },
          {
            stage: 'In Transit',
            location: 'En route to Mumbai',
            date: '2024-01-20',
            person: 'Transport Partner',
            details: 'Refrigerated transport, ETA: 2 days'
          }
        ]
      },
      'DEMO002': {
        id: 'BATCH-DEMO002',
        cropType: 'Organic Tomatoes',
        quantity: 500,
        harvestDate: '2024-01-20',
        farmer: 'Demo Farmer - Priya Sharma',
        farmLocation: 'Maharashtra, India',
        certifications: ['Organic', 'Fair Trade'],
        currentOwner: 'Retailer',
        status: 'In Store',
        qrCode: 'DEMO002',
        journey: [
          {
            stage: 'Farm',
            location: 'Maharashtra, India',
            date: '2024-01-20',
            person: 'Priya Sharma',
            details: 'Harvested fresh organic tomatoes'
          },
          {
            stage: 'Distributor',
            location: 'Mumbai Hub',
            date: '2024-01-21',
            person: 'Fresh Foods Distributors',
            details: 'Same day processing and dispatch'
          },
          {
            stage: 'Retailer',
            location: 'Mumbai Supermarket',
            date: '2024-01-22',
            person: 'FreshMart Store',
            details: 'Available for purchase'
          }
        ]
      },
      'DEMO003': {
        id: 'BATCH-DEMO003',
        cropType: 'Wheat',
        quantity: 2000,
        harvestDate: '2024-01-10',
        farmer: 'Demo Farmer - Suresh Patel',
        farmLocation: 'Gujarat, India',
        certifications: ['Quality Assured'],
        currentOwner: 'Processing',
        status: 'Under Processing',
        qrCode: 'DEMO003',
        journey: [
          {
            stage: 'Farm',
            location: 'Gujarat, India',
            date: '2024-01-10',
            person: 'Suresh Patel',
            details: 'High-quality wheat harvest'
          },
          {
            stage: 'Distributor',
            location: 'Ahmedabad Warehouse',
            date: '2024-01-12',
            person: 'Gujarat Grains Ltd',
            details: 'Quality testing completed'
          },
          {
            stage: 'Processing',
            location: 'Flour Mill',
            date: '2024-01-15',
            person: 'Modern Mills Pvt Ltd',
            details: 'Being processed into flour'
          }
        ]
      }
    };
    
    return demoData[qrId];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Store':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Under Processing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Farm':
        return <Package className="h-4 w-4" />;
      case 'Distributor':
        return <Truck className="h-4 w-4" />;
      case 'In Transit':
        return <Clock className="h-4 w-4" />;
      case 'Retailer':
        return <CheckCircle className="h-4 w-4" />;
      case 'Processing':
        return <Scan className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (scannedData) {
    return (
      <div className="space-y-6">
        {/* Product Info Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{scannedData.cropType}</CardTitle>
                <CardDescription>
                  Batch ID: {scannedData.id}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(scannedData.status)}>
                {scannedData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Farmer</p>
                  <p className="font-medium">{scannedData.farmer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium">{scannedData.farmLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Harvest Date</p>
                  <p className="font-medium">{scannedData.harvestDate}</p>
                </div>
              </div>
            </div>
            
            {scannedData.certifications && scannedData.certifications.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                <div className="flex gap-2 flex-wrap">
                  {scannedData.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Journey Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Product Journey</CardTitle>
            <CardDescription>Track the complete journey from farm to your table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scannedData.journey && scannedData.journey.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getStageIcon(step.stage)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{step.stage}</h4>
                      <Badge variant="outline">{step.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{step.person}</p>
                    <p className="text-sm text-muted-foreground">{step.location}</p>
                    <p className="text-sm mt-2">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => setScannedData(null)} className="w-full">
          Scan Another QR Code
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Demo QR Scanner
          </CardTitle>
          <CardDescription>
            Try scanning our demo QR codes to see product traceability in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo QR Codes */}
          <div className="space-y-3">
            <h4 className="font-medium">Try these demo QR codes:</h4>
            <div className="grid grid-cols-1 gap-3">
              {demoQRCodes.map((qr) => (
                <Card key={qr.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleDemoScan(qr.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{qr.id}</p>
                          <p className="text-sm text-muted-foreground">{qr.label}</p>
                        </div>
                      </div>
                      <Button size="sm" disabled={loading}>
                        {loading ? 'Scanning...' : 'Scan'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Manual Entry */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter manually
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Enter QR code (e.g., DEMO001)"
              value={manualInput}
              onChange={(e) => {
                setManualInput(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={handleManualSubmit} className="w-full" disabled={loading}>
              {loading ? 'Scanning...' : 'Scan QR Code'}
            </Button>
          </div>

          <Alert>
            <QrCode className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a demonstration of AgriTrace's QR scanning feature. 
              In production, you would scan actual QR codes printed on product packaging.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}