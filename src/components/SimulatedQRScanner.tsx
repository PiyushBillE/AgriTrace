import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QrCode, Camera, Package, MapPin, Calendar, User, CheckCircle, Clock, Truck, Store, Scan, X, Shield } from 'lucide-react';
import { Progress } from './ui/progress';

interface SimulatedQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: any) => void;
}

export function SimulatedQRScanner({ isOpen, onClose, onScanComplete }: SimulatedQRScannerProps) {
  const [scanStep, setScanStep] = useState<'scanning' | 'processing' | 'complete'>('scanning');
  const [progress, setProgress] = useState(0);
  const [scannedData, setScannedData] = useState(null);

  // Demo QR codes with enhanced blockchain data
  const demoQRCodes = [
    {
      id: 'DEMO001',
      batchData: {
        id: 'BATCH-DEMO001-2024',
        cropType: 'Basmati Rice',
        quantity: 1000,
        harvestDate: '2024-01-15',
        farmer: {
          name: 'Rajesh Kumar',
          username: 'rajesh_farmer_001',
          location: 'Punjab, India',
          farmId: 'FARM-RK-001'
        },
        certifications: ['Organic', 'Non-GMO', 'Fair Trade'],
        currentOwner: 'retailer',
        status: 'Available in Store',
        qrCode: 'DEMO001',
        blockchainTransactions: [
          {
            id: 'TX-0x4a7b8c9d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
            type: 'batch_creation',
            from: 'Farm Genesis',
            to: 'rajesh_farmer_001',
            timestamp: '2024-01-15T08:30:00Z',
            details: 'Batch created and registered on blockchain',
            gasUsed: '21,000',
            blockNumber: '18,456,789'
          },
          {
            id: 'TX-0x7d8e9f0a1b2c3456789abcdef0123456789abcdef0123456789abcdef01234568',
            type: 'farmer_to_distributor',
            from: 'rajesh_farmer_001',
            to: 'northern_dist_ltd',
            timestamp: '2024-01-18T10:15:00Z',
            details: 'Transfer to distributor with quality certification',
            gasUsed: '35,000',
            blockNumber: '18,458,123'
          },
          {
            id: 'TX-0x9f0a1b2c3d4e5678901abcdef0123456789abcdef0123456789abcdef01234569',
            type: 'distributor_to_retailer',
            from: 'northern_dist_ltd',
            to: 'freshmart_mumbai',
            timestamp: '2024-01-22T14:45:00Z',
            details: 'Final transfer to retail store',
            gasUsed: '28,500',
            blockNumber: '18,462,456'
          }
        ],
        journey: [
          {
            stage: 'Farm Creation',
            username: 'rajesh_farmer_001',
            location: 'Punjab, India',
            date: '2024-01-15',
            person: 'Rajesh Kumar',
            details: 'Harvested from certified organic farm',
            transactionId: 'TX-0x4a7b8c9d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
            icon: Package
          },
          {
            stage: 'Distributor Processing',
            username: 'northern_dist_ltd',
            location: 'Delhi Warehouse',
            date: '2024-01-18',
            person: 'Northern Distributors Ltd',
            details: 'Quality checked and stored at controlled temperature',
            transactionId: 'TX-0x7d8e9f0a1b2c3456789abcdef0123456789abcdef0123456789abcdef01234568',
            icon: Truck
          },
          {
            stage: 'Retail Store',
            username: 'freshmart_mumbai',
            location: 'Mumbai Supermarket',
            date: '2024-01-22',
            person: 'FreshMart Mumbai',
            details: 'Available for purchase by consumers',
            transactionId: 'TX-0x9f0a1b2c3d4e5678901abcdef0123456789abcdef0123456789abcdef01234569',
            icon: Store
          }
        ]
      }
    },
    {
      id: 'DEMO002',
      batchData: {
        id: 'BATCH-DEMO002-2024',
        cropType: 'Organic Tomatoes',
        quantity: 500,
        harvestDate: '2024-01-20',
        farmer: {
          name: 'Priya Sharma',
          username: 'priya_organic_farms',
          location: 'Maharashtra, India',
          farmId: 'FARM-PS-002'
        },
        certifications: ['Organic', 'Fair Trade', 'Pesticide Free'],
        currentOwner: 'retailer',
        status: 'Fresh in Store',
        qrCode: 'DEMO002',
        blockchainTransactions: [
          {
            id: 'TX-0x2b3c4d5e6f7a8901bcdef0123456789abcdef0123456789abcdef0123456780',
            type: 'batch_creation',
            from: 'Farm Genesis',
            to: 'priya_organic_farms',
            timestamp: '2024-01-20T06:00:00Z',
            details: 'Organic tomatoes batch registered',
            gasUsed: '22,500',
            blockNumber: '18,459,234'
          },
          {
            id: 'TX-0x4d5e6f7a8b9c012def0123456789abcdef0123456789abcdef0123456781',
            type: 'farmer_to_distributor',
            from: 'priya_organic_farms',
            to: 'fresh_foods_dist',
            timestamp: '2024-01-21T08:30:00Z',
            details: 'Fast-track distribution for fresh produce',
            gasUsed: '31,200',
            blockNumber: '18,460,567'
          },
          {
            id: 'TX-0x6f7a8b9c0d1e234f0123456789abcdef0123456789abcdef0123456782',
            type: 'distributor_to_retailer',
            from: 'fresh_foods_dist',
            to: 'organic_store_pune',
            timestamp: '2024-01-22T11:15:00Z',
            details: 'Delivered to organic specialty store',
            gasUsed: '26,700',
            blockNumber: '18,461,890'
          }
        ],
        journey: [
          {
            stage: 'Organic Farm',
            username: 'priya_organic_farms',
            location: 'Maharashtra, India',
            date: '2024-01-20',
            person: 'Priya Sharma',
            details: 'Harvested fresh organic tomatoes with fair trade certification',
            transactionId: 'TX-0x2b3c4d5e6f7a8901bcdef0123456789abcdef0123456789abcdef0123456780',
            icon: Package
          },
          {
            stage: 'Express Distribution',
            username: 'fresh_foods_dist',
            location: 'Mumbai Hub',
            date: '2024-01-21',
            person: 'Fresh Foods Distributors',
            details: 'Same day processing for maximum freshness',
            transactionId: 'TX-0x4d5e6f7a8b9c012def0123456789abcdef0123456789abcdef0123456781',
            icon: Truck
          },
          {
            stage: 'Organic Store',
            username: 'organic_store_pune',
            location: 'Pune Organic Market',
            date: '2024-01-22',
            person: 'Green Valley Organic Store',
            details: 'Premium organic produce section',
            transactionId: 'TX-0x6f7a8b9c0d1e234f0123456789abcdef0123456789abcdef0123456782',
            icon: Store
          }
        ]
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setScanStep('scanning');
      setProgress(0);
      setScannedData(null);
      
      // Simulate scanning process
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setScanStep('processing');
            
            // Simulate processing
            setTimeout(() => {
              const randomDemo = demoQRCodes[Math.floor(Math.random() * demoQRCodes.length)];
              setScannedData(randomDemo.batchData);
              setScanStep('complete');
            }, 2000);
            
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleComplete = () => {
    onScanComplete(scannedData);
    onClose();
  };

  const handleClose = () => {
    setScanStep('scanning');
    setProgress(0);
    setScannedData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
          <DialogDescription>
            Scanning product QR code for blockchain verification
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {scanStep === 'scanning' && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto border-2 border-dashed border-primary rounded-lg flex items-center justify-center bg-muted/50">
                  <Camera className="h-12 w-12 text-muted-foreground animate-pulse" />
                </div>
                <div className="absolute inset-0 border-2 border-primary rounded-lg animate-ping"></div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Scanning QR Code...</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please hold the camera steady over the QR code
              </p>
              
              <Progress value={progress} className="w-full mb-4" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% Complete
              </p>
            </div>
          )}
          
          {scanStep === 'processing' && (
            <div className="text-center py-8">
              <Scan className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Processing Blockchain Data...</h3>
              <p className="text-sm text-muted-foreground">
                Verifying product authenticity and traceability
              </p>
            </div>
          )}
          
          {scanStep === 'complete' && scannedData && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">QR Code Verified!</h3>
                <p className="text-sm text-muted-foreground">
                  Product authenticity confirmed on blockchain
                </p>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{scannedData.cropType}</h4>
                    <Badge variant="outline">{scannedData.status}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch ID:</span>
                      <span className="font-mono text-xs">{scannedData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Farmer:</span>
                      <span>{scannedData.farmer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span>{scannedData.farmer.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain TXs:</span>
                      <span>{scannedData.blockchainTransactions.length} verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button onClick={handleComplete} className="flex-1">
                  View Complete Journey
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}