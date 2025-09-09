import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, QrCode, Wallet, TrendingUp, Package, Upload, IndianRupee, Calendar, MapPin, Truck, Store, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { QRCodeDisplay } from './QRCodeDisplay';
import { cropCategories } from './CropCategories';
import { api } from '../utils/api';

export function FarmerDashboard() {
  const [newBatch, setNewBatch] = useState({
    cropType: '',
    cropCategory: '',
    quantity: '',
    harvestDate: '',
    location: '',
    expenses: {
      seeds: '',
      fertilizer: '',
      labor: '',
      other: ''
    },
    certifications: [],
    saleType: 'distributor', // distributor or retailer
    targetBuyer: '', // username of distributor/retailer
    buyerName: '' // display name of buyer
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdBatch, setCreatedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBatches, setUserBatches] = useState([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalRevenue: 0,
    walletBalance: 0
  });

  // Load user batches on component mount
  useEffect(() => {
    loadUserBatches();
  }, []);

  const loadUserBatches = async () => {
    try {
      // For demo, use a mock farmer ID. In production, this would come from authentication
      const farmerId = 'farmer-demo-123';
      const result = await api.getUserBatches(farmerId);
      
      if (result.success) {
        setUserBatches(result.batches);
        setStats({
          totalBatches: result.batches.length,
          totalRevenue: result.batches.reduce((sum, batch) => sum + (batch.revenue || 0), 0),
          walletBalance: result.batches.length * 1500 // Mock calculation
        });
      }
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const handleCreateBatch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const totalExpenses = Object.values(newBatch.expenses)
        .map(exp => parseFloat(exp) || 0)
        .reduce((sum, exp) => sum + exp, 0);
      
      // For demo, use a mock farmer ID. In production, this would come from authentication
      const farmerId = 'farmer-demo-123';
      
      const batchData = {
        ...newBatch,
        farmerId,
        totalExpenses,
        farmer: 'Demo Farmer', // In production, this would come from user profile
        quantity: parseFloat(newBatch.quantity),
        harvestDate: newBatch.harvestDate,
        location: newBatch.location
      };
      
      const result = await api.createBatch(batchData);
      
      if (result.success) {
        setCreatedBatch(result.batch);
        setShowCreateForm(false);
        
        // Reload batches to show the new one
        await loadUserBatches();
        
        // Reset form
        setNewBatch({
          cropType: '',
          cropCategory: '',
          quantity: '',
          harvestDate: '',
          location: '',
          expenses: { seeds: '', fertilizer: '', labor: '', other: '' },
          certifications: [],
          saleType: 'distributor',
          targetBuyer: '',
          buyerName: ''
        });
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      setError(err.message || 'Failed to create batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-semibold">{stats.totalBatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Wallet className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-semibold">₹{stats.walletBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <IndianRupee className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">MSP Available</p>
                <p className="text-2xl font-semibold">₹2,150/qt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Alert for Created Batch */}
      {createdBatch && (
        <Alert className="border-green-200 bg-green-50">
          <QrCode className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                New batch <strong>{createdBatch.id}</strong> created successfully! 
                Transaction: {createdBatch.txHash}
              </span>
              <QRCodeDisplay batchData={createdBatch} />
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">My Batches</TabsTrigger>
          <TabsTrigger value="create">Create New Batch</TabsTrigger>
          <TabsTrigger value="msp">MSP & Procurement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>My Product Batches</h3>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Batch
            </Button>
          </div>
          
          {userBatches.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No batches created yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first product batch to track on the blockchain
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Batch
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBatches.map((batch) => (
                <Card key={batch.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{batch.cropType}</CardTitle>
                      <Badge variant="outline">{batch.status}</Badge>
                    </div>
                    <CardDescription>
                      Batch ID: {batch.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{batch.quantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harvest Date:</span>
                        <span>{batch.harvestDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{batch.location}</span>
                      </div>
                      {batch.totalExpenses && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost:</span>
                          <span>₹{batch.totalExpenses.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <QRCodeDisplay batchData={batch} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Register New Batch</CardTitle>
              <CardDescription>
                Create a new product batch on the blockchain with immutable records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropCategory">Crop Category</Label>
                  <Select onValueChange={(value) => {
                    setNewBatch({...newBatch, cropCategory: value, cropType: ''});
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cropCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cropType">Specific Crop</Label>
                  <Select 
                    value={newBatch.cropType}
                    onValueChange={(value) => setNewBatch({...newBatch, cropType: value})}
                    disabled={!newBatch.cropCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newBatch.cropCategory ? "Select specific crop" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {newBatch.cropCategory && cropCategories[newBatch.cropCategory]?.items.map((crop) => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 1000"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={newBatch.harvestDate}
                    onChange={(e) => setNewBatch({...newBatch, harvestDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Village, District, State"
                    value={newBatch.location}
                    onChange={(e) => setNewBatch({...newBatch, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saleType">Sale Type</Label>
                  <Select 
                    value={newBatch.saleType}
                    onValueChange={(value) => setNewBatch({...newBatch, saleType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sale type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distributor">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>Sell to Distributor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="retailer">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          <span>Sell Directly to Retailer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetBuyer">
                    {newBatch.saleType === 'distributor' ? 'Distributor Username' : 'Retailer Username'}
                  </Label>
                  <Input
                    id="targetBuyer"
                    placeholder={newBatch.saleType === 'distributor' ? 'e.g., northern_distributors' : 'e.g., fresh_mart_store'}
                    value={newBatch.targetBuyer}
                    onChange={(e) => setNewBatch({...newBatch, targetBuyer: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerName">
                    {newBatch.saleType === 'distributor' ? 'Distributor Name' : 'Retailer Name'}
                  </Label>
                  <Input
                    id="buyerName"
                    placeholder={newBatch.saleType === 'distributor' ? 'e.g., Northern Distributors Ltd' : 'e.g., Fresh Mart Mumbai'}
                    value={newBatch.buyerName}
                    onChange={(e) => setNewBatch({...newBatch, buyerName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Production Expenses (₹)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="seeds" className="text-sm">Seeds</Label>
                    <Input
                      id="seeds"
                      type="number"
                      placeholder="0"
                      value={newBatch.expenses.seeds}
                      onChange={(e) => setNewBatch({
                        ...newBatch, 
                        expenses: {...newBatch.expenses, seeds: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fertilizer" className="text-sm">Fertilizer</Label>
                    <Input
                      id="fertilizer"
                      type="number"
                      placeholder="0"
                      value={newBatch.expenses.fertilizer}
                      onChange={(e) => setNewBatch({
                        ...newBatch, 
                        expenses: {...newBatch.expenses, fertilizer: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="labor" className="text-sm">Labor</Label>
                    <Input
                      id="labor"
                      type="number"
                      placeholder="0"
                      value={newBatch.expenses.labor}
                      onChange={(e) => setNewBatch({
                        ...newBatch, 
                        expenses: {...newBatch.expenses, labor: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="other" className="text-sm">Other</Label>
                    <Input
                      id="other"
                      type="number"
                      placeholder="0"
                      value={newBatch.expenses.other}
                      onChange={(e) => setNewBatch({
                        ...newBatch, 
                        expenses: {...newBatch.expenses, other: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Upload Receipts & Certificates</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload images of receipts, organic certificates, soil test reports
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateBatch} 
                className="w-full"
                disabled={!newBatch.cropType || !newBatch.quantity || !newBatch.harvestDate || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Batch...
                  </>
                ) : (
                  'Register Batch on Blockchain'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="msp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current MSP Rates</CardTitle>
                <CardDescription>Minimum Support Price guaranteed by government</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Rice</span>
                    <span className="font-semibold">₹2,150/quintal</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Wheat</span>
                    <span className="font-semibold">₹2,275/quintal</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Sugarcane</span>
                    <span className="font-semibold">₹315/quintal</span>
                  </div>
                </div>
                <Button className="w-full">
                  Sell to Government Procurement Center
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Escrow</CardTitle>
                <CardDescription>Automated payments upon delivery confirmation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Pending Escrow:</p>
                    <p className="font-semibold text-lg">₹0</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Awaiting Delivery Confirmation:</p>
                    <p>0 batches</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Escrow Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}