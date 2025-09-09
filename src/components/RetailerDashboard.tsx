import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Store, Package, IndianRupee, TrendingUp, QrCode, Users, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { QRScanner } from './QRScanner';
import { mockBatches, mockTransactions } from './MockData';

export function RetailerDashboard() {
  const [scanMode, setScanMode] = useState(false);
  const [scannedBatch, setScannedBatch] = useState(null);
  const [retailPrice, setRetailPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleScanResult = (qrData) => {
    // Simulate finding batch from QR data
    const batchId = qrData.split('/').pop();
    const batch = mockBatches.find(b => b.id === batchId);
    
    if (batch) {
      setScannedBatch(batch);
      setScanMode(false);
    }
  };

  const handleSetRetailPrice = () => {
    if (!scannedBatch || !retailPrice) return;
    
    // Simulate blockchain transaction for price update
    const priceTx = {
      id: `TX-${Date.now()}`,
      batchId: scannedBatch.id,
      actor: 'FreshMart Supermarket',
      type: 'price_update',
      price: parseFloat(retailPrice),
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 8)}...`
    };

    setSuccessMessage(`Retail price set to ₹${retailPrice}/kg. Transaction: ${priceTx.txHash}`);
    setScannedBatch(null);
    setRetailPrice('');
  };

  const retailerBatches = mockBatches.filter(batch => 
    batch.currentOwner === 'FreshMart Supermarket' || 
    batch.history?.some(h => h.actor === 'FreshMart Supermarket')
  );

  const availableForSale = retailerBatches.filter(batch => batch.retailPrice);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory</p>
                <p className="text-2xl font-semibold">{retailerBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available for Sale</p>
                <p className="text-2xl font-semibold">{availableForSale.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <IndianRupee className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Revenue</p>
                <p className="text-2xl font-semibold">₹15,250</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">QR Scans Today</p>
                <p className="text-2xl font-semibold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing">Set Retail Prices</TabsTrigger>
          <TabsTrigger value="inventory">Store Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan & Set Retail Price</CardTitle>
              <CardDescription>
                Scan incoming batches from distributors and set retail pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scanMode && !scannedBatch && (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Scan QR code to accept delivery and set retail price
                  </p>
                  <Button onClick={() => setScanMode(true)} className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Start Scanning
                  </Button>
                </div>
              )}

              {scanMode && (
                <QRScanner onScanResult={handleScanResult} onCancel={() => setScanMode(false)} />
              )}

              {scannedBatch && (
                <div className="space-y-4">
                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription>
                      Batch found: <strong>{scannedBatch.id}</strong> - {scannedBatch.cropType}
                    </AlertDescription>
                  </Alert>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Product:</span>
                          <p>{scannedBatch.cropType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <p>{scannedBatch.quantity} kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Farmer Price:</span>
                          <p>₹{scannedBatch.basePrice}/kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wholesale Price:</span>
                          <p>₹{(scannedBatch.basePrice * 1.2).toFixed(2)}/kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Origin:</span>
                          <p>{scannedBatch.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <p className="flex items-center gap-1">
                            Grade A
                            {scannedBatch.certifications?.includes('Organic') && (
                              <Badge variant="outline" className="text-xs">Organic</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Set Retail Price</CardTitle>
                      <CardDescription>
                        Set the final consumer price for this batch
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="retailPrice">Retail Price (₹/kg)</Label>
                          <Input
                            id="retailPrice"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 45.00"
                            value={retailPrice}
                            onChange={(e) => setRetailPrice(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Margin</Label>
                          <div className="h-10 px-3 py-2 border border-input bg-background rounded-md flex items-center text-sm">
                            {retailPrice ? 
                              `${(((parseFloat(retailPrice) - scannedBatch.basePrice * 1.2) / (scannedBatch.basePrice * 1.2)) * 100).toFixed(1)}%` : 
                              '0%'
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Total Revenue</Label>
                          <div className="h-10 px-3 py-2 border border-input bg-background rounded-md flex items-center text-sm">
                            ₹{retailPrice ? (parseFloat(retailPrice) * scannedBatch.quantity).toFixed(2) : '0.00'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground">Price breakdown:</p>
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between">
                            <span>Farmer price:</span>
                            <span>₹{scannedBatch.basePrice}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wholesale price (+20%):</span>
                            <span>₹{(scannedBatch.basePrice * 1.2).toFixed(2)}/kg</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Your retail price:</span>
                            <span>₹{retailPrice || '0.00'}/kg</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSetRetailPrice}
                          className="flex-1"
                          disabled={!retailPrice || parseFloat(retailPrice) <= 0}
                        >
                          Set Price & Make Available for Sale
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setScannedBatch(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Store Inventory</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{retailerBatches.length} total items</Badge>
              <Badge variant="default">{availableForSale.length} on sale</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retailerBatches.map((batch) => (
              <Card key={batch.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{batch.cropType}</CardTitle>
                    <Badge variant={batch.retailPrice ? "default" : "outline"}>
                      {batch.retailPrice ? "On Sale" : "Pricing Pending"}
                    </Badge>
                  </div>
                  <CardDescription>Batch ID: {batch.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <p>{batch.quantity} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wholesale:</span>
                      <p>₹{(batch.basePrice * 1.2).toFixed(2)}/kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Retail Price:</span>
                      <p>{batch.retailPrice ? `₹${batch.retailPrice}/kg` : 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margin:</span>
                      <p>{batch.retailPrice ? 
                          `${(((batch.retailPrice - batch.basePrice * 1.2) / (batch.basePrice * 1.2)) * 100).toFixed(1)}%` : 
                          'N/A'}</p>
                    </div>
                  </div>
                  
                  {batch.certifications && batch.certifications.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {batch.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    {!batch.retailPrice ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        Set Price
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1">
                        Update Price
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      QR Labels
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Today's sales metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Total Sales</span>
                    <span className="font-semibold">₹15,250</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Items Sold</span>
                    <span className="font-semibold">127 kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Average Margin</span>
                    <span className="font-semibold">23.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>QR Code Scans</span>
                    <span className="font-semibold">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Transparency Metrics</CardTitle>
                <CardDescription>Consumer trust indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>QR Scans per Sale</span>
                    <span className="font-semibold">73%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Organic Products</span>
                    <span className="font-semibold">12 batches</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Local Farms</span>
                    <span className="font-semibold">8 farmers</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Verified Origin</span>
                    <span className="font-semibold">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}