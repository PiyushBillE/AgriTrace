import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { QrCode, Camera, Scan } from 'lucide-react';
import { SimulatedQRScanner } from './SimulatedQRScanner';
import { ProductDetailsPage } from './ProductDetailsPage';

export function ConsumerPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [productData, setProductData] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);

  const handleScanComplete = (data: any) => {
    setProductData(data);
    setViewDetails(true);
    setShowScanner(false);
  };

  const handleBackToScanner = () => {
    setViewDetails(false);
    setProductData(null);
  };

  const handleStartScan = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  if (viewDetails && productData) {
    return (
      <ProductDetailsPage 
        productData={productData} 
        onBack={handleBackToScanner} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
        <QrCode className="h-16 w-16 mx-auto text-green-600 mb-4" />
        <h2 className="text-4xl font-bold mb-4">Verify Your Food's Journey</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Scan the QR code on your product to see its complete farm-to-table story, 
          verified on the blockchain for complete transparency and authenticity.
        </p>
      </div>

      {/* Main Scan Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-dashed border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <Camera className="h-8 w-8 text-primary" />
              Product QR Scanner
            </CardTitle>
            <CardDescription className="text-base">
              Point your camera at the QR code on the product packaging to begin verification
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto border-4 border-primary border-dashed rounded-lg flex items-center justify-center bg-primary/5">
                <Scan className="h-12 w-12 text-primary" />
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleStartScan}
                  size="lg"
                  className="w-full max-w-xs mx-auto text-lg py-6"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start QR Code Scan
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Our scanner will automatically detect and verify your product's QR code
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Verification</h3>
            <p className="text-sm text-muted-foreground">
              Scan any product QR code to instantly verify its authenticity and journey
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Blockchain Secured</h3>
            <p className="text-sm text-muted-foreground">
              All product data is secured on blockchain, ensuring complete transparency
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Complete Journey</h3>
            <p className="text-sm text-muted-foreground">
              Track every step from farm to your table with detailed transaction history
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      <SimulatedQRScanner 
        isOpen={showScanner}
        onClose={handleCloseScanner}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
}