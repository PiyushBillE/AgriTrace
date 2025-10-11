import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { QrCode, Truck, Thermometer, Package, Clock, CheckCircle, AlertTriangle, IndianRupee, Calendar, Timer, ArrowRight, ArrowLeft, User, MapPin, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { api } from '../utils/api';

export function DistributorDashboard() {
  const [incomingBatches, setIncomingBatches] = useState([]);
  const [outgoingBatches, setOutgoingBatches] = useState([]);
  const [processingBatch, setProcessingBatch] = useState(null);
  const [transferData, setTransferData] = useState({
    temperature: '',
    storageCondition: '',
    transitTime: '',
    qualityNotes: '',
    wholesaleRate: '',
    dateReceived: new Date().toISOString().split('T')[0],
    shelfLife: '',
    retailerUsername: '',
    retailerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mock distributor username
  const distributorUsername = 'northern_distributors';

  useEffect(() => {
    loadIncomingBatches();
    loadOutgoingBatches();
  }, []);

  const loadIncomingBatches = async () => {
    try {
      // In production, this would fetch batches where targetBuyer matches distributor username
      // For demo, we'll use mock data that simulates incoming batches from farmers
      const mockIncoming = [
        {
          id: 'BATCH-FARMER-001',
          cropType: 'Basmati Rice',
          quantity: 1000,
          farmer: {
            name: 'Rajesh Kumar',
            username: 'rajesh_farmer_001',
            location: 'Punjab, India'
          },
          harvestDate: '2024-01-15',
          status: 'Pending Acceptance',
          targetBuyer: distributorUsername,
          buyerName: 'Northern Distributors Ltd',
          saleType: 'distributor',
          certifications: ['Organic', 'Non-GMO'],
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'BATCH-FARMER-002',
          cropType: 'Organic Tomatoes',
          quantity: 500,
          farmer: {
            name: 'Priya Sharma',
            username: 'priya_organic_farms',
            location: 'Maharashtra, India'
          },
          harvestDate: '2024-01-20',
          status: 'Ready for Pickup',
          targetBuyer: distributorUsername,
          buyerName: 'Northern Distributors Ltd',
          saleType: 'distributor',
          certifications: ['Organic', 'Fair Trade'],
          createdAt: '2024-01-20T06:00:00Z'
        }
      ];
      
      setIncomingBatches(mockIncoming);
    } catch (error) {
      console.error('Error loading incoming batches:', error);
    }
  };

  const loadOutgoingBatches = async () => {
    try {
      // Mock outgoing batches to retailers
      const mockOutgoing = [
        {
          id: 'BATCH-DIST-001',
          cropType: 'Basmati Rice',
          quantity: 800,
          originalFarmer: 'Rajesh Kumar',
          distributorProcessing: {
            wholesaleRate: 45,
            dateReceived: '2024-01-18',
            shelfLife: '12 months',
            storageCondition: 'Dry, Cool Storage'
          },
          targetRetailer: {
            username: 'freshmart_mumbai',
            name: 'FreshMart Mumbai'
          },
          status: 'In Transit',
          createdAt: '2024-01-18T14:00:00Z'
        }
      ];
      
      setOutgoingBatches(mockOutgoing);
    } catch (error) {
      console.error('Error loading outgoing batches:', error);
    }
  };

  const handleAcceptBatch = async (batch) => {
    setProcessingBatch(batch);
    setTransferData({
      temperature: '',
      storageCondition: '',
      transitTime: '',
      qualityNotes: '',
      wholesaleRate: '',
      dateReceived: new Date().toISOString().split('T')[0],
      shelfLife: '',
      retailerUsername: '',
      retailerName: ''
    });
  };

  const handleProcessBatch = async () => {
    if (!processingBatch) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate processing the batch
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transfer data for blockchain
      const processedBatch = {
        ...processingBatch,
        distributorProcessing: transferData,
        status: 'Processed by Distributor',
        processedAt: new Date().toISOString()
      };
      
      setSuccessMessage(`Batch ${processingBatch.id} processed successfully!`);
      setProcessingBatch(null);
      
      // Reload data
      await loadIncomingBatches();
      await loadOutgoingBatches();
      
    } catch (err) {
      setError('Failed to process batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToRetailer = async (batch) => {
    setLoading(true);
    try {
      // Simulate transfer to retailer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`Batch ${batch.id} transferred to ${batch.targetRetailer.name}!`);
      await loadOutgoingBatches();
    } catch (err) {
      setError('Failed to transfer batch.');
    } finally {
      setLoading(false);
    }
  };

  const getBatchStatusColor = (status) => {
    switch (status) {
      case 'Pending Acceptance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Processed by Distributor':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ArrowLeft className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Incoming Batches</p>
                <p className="text-2xl font-semibold">{incomingBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ArrowRight className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Outgoing Batches</p>
                <p className="text-2xl font-semibold">{outgoingBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-semibold">1.5k kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <IndianRupee className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-semibold">₹67,500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming">Incoming from Farmers</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing to Retailers</TabsTrigger>
          <TabsTrigger value="processing">Batch Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Products from Farmers</h3>
            <Badge variant="outline">{incomingBatches.length} pending</Badge>
          </div>
          
          {incomingBatches.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No incoming batches</h3>
              <p className="text-muted-foreground">
                Batches from farmers will appear here when they assign you as their distributor
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingBatches.map((batch) => (
                <Card key={batch.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{batch.cropType}</CardTitle>
                      <Badge className={getBatchStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      From: @{batch.farmer.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Farmer</p>
                          <p className="font-medium">{batch.farmer.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{batch.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">{batch.farmer.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Harvest Date</p>
                          <p className="font-medium">{batch.harvestDate}</p>
                        </div>
                      </div>
                      
                      {batch.certifications && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                          <div className="flex gap-1 flex-wrap">
                            {batch.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleAcceptBatch(batch)}
                        className="w-full"
                        disabled={batch.status === 'Processed by Distributor'}
                      >
                        {batch.status === 'Processed by Distributor' ? 'Already Processed' : 'Accept & Process'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Products to Retailers</h3>
            <Badge variant="outline">{outgoingBatches.length} in queue</Badge>
          </div>
          
          {outgoingBatches.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No outgoing batches</h3>
              <p className="text-muted-foreground">
                Processed products ready for retailers will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outgoingBatches.map((batch) => (
                <Card key={batch.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{batch.cropType}</CardTitle>
                      <Badge className={getBatchStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      To: @{batch.targetRetailer.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Original Farmer</p>
                          <p className="font-medium">{batch.originalFarmer}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{batch.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Wholesale Rate</p>
                          <p className="font-medium">₹{batch.distributorProcessing.wholesaleRate}/kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Shelf Life</p>
                          <p className="font-medium">{batch.distributorProcessing.shelfLife}</p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded text-sm">
                        <p className="text-muted-foreground">Storage Condition</p>
                        <p>{batch.distributorProcessing.storageCondition}</p>
                      </div>
                      
                      <Button 
                        onClick={() => handleTransferToRetailer(batch)}
                        className="w-full"
                        disabled={batch.status === 'Delivered' || loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          batch.status === 'Delivered' ? 'Already Delivered' : 'Transfer to Retailer'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingBatch ? (
            <Card>
              <CardHeader>
                <CardTitle>Processing Batch: {processingBatch.id}</CardTitle>
                <CardDescription>
                  Add distributor-specific information and set wholesale pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Original Product Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product:</span>
                      <p className="font-medium">{processingBatch.cropType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Farmer:</span>
                      <p className="font-medium">{processingBatch.farmer.name} (@{processingBatch.farmer.username})</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <p className="font-medium">{processingBatch.quantity} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Harvest Date:</span>
                      <p className="font-medium">{processingBatch.harvestDate}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wholesaleRate">Wholesale Rate (₹/kg)</Label>
                    <Input
                      id="wholesaleRate"
                      type="number"
                      placeholder="e.g., 45"
                      value={transferData.wholesaleRate}
                      onChange={(e) => setTransferData({...transferData, wholesaleRate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shelfLife">Shelf Life</Label>
                    <Input
                      id="shelfLife"
                      placeholder="e.g., 12 months"
                      value={transferData.shelfLife}
                      onChange={(e) => setTransferData({...transferData, shelfLife: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storageCondition">Storage Condition</Label>
                    <Input
                      id="storageCondition" 
                      placeholder="e.g., Dry, Cool Storage"
                      value={transferData.storageCondition}
                      onChange={(e) => setTransferData({...transferData, storageCondition: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateReceived">Date Received</Label>
                    <Input
                      id="dateReceived"
                      type="date"
                      value={transferData.dateReceived}
                      onChange={(e) => setTransferData({...transferData, dateReceived: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retailerUsername">Target Retailer Username</Label>
                    <Input
                      id="retailerUsername"
                      placeholder="e.g., freshmart_mumbai"
                      value={transferData.retailerUsername}
                      onChange={(e) => setTransferData({...transferData, retailerUsername: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retailerName">Retailer Name</Label>
                    <Input
                      id="retailerName"
                      placeholder="e.g., FreshMart Mumbai"
                      value={transferData.retailerName}
                      onChange={(e) => setTransferData({...transferData, retailerName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualityNotes">Quality Assessment Notes</Label>
                  <Textarea
                    id="qualityNotes"
                    placeholder="Add quality inspection notes, temperature logs, etc."
                    value={transferData.qualityNotes}
                    onChange={(e) => setTransferData({...transferData, qualityNotes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProcessBatch}
                    disabled={!transferData.wholesaleRate || !transferData.shelfLife || loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Processing'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setProcessingBatch(null)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a batch to process</h3>
              <p className="text-muted-foreground">
                Go to the "Incoming from Farmers" tab to accept and process batches
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}