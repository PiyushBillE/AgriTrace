import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { BarChart, Users, TrendingUp, Calculator, IndianRupee, PieChart, Activity, AlertCircle, Target, Tractor, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { api } from '../utils/api';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ExpenseData {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  cropCategory: string;
  season: string;
  farmSize: number;
  totalExpenses: number;
  expensePerAcre: number;
  expenses: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    labor: number;
    irrigation: number;
    machinery: number;
    transportation: number;
    storage: number;
    other: number;
  };
  notes: string;
  submittedAt: string;
}

export function AdminDashboard() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFarmers, setExpandedFarmers] = useState<string[]>([]);

  useEffect(() => {
    loadExpenseData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedCrop !== 'all') {
      setFilteredExpenses(expenses.filter(exp => exp.cropType === selectedCrop));
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedCrop, expenses]);

  const loadExpenseData = async () => {
    try {
      setLoading(true);
      
      // Load all expenses and crop types
      const [expensesResult, cropTypesResult] = await Promise.all([
        api.getAllExpenses(),
        api.getCropTypes()
      ]);
      
      if (expensesResult.success) {
        setExpenses(expensesResult.expenses || []);
      }
      
      if (cropTypesResult.success) {
        setCropTypes(cropTypesResult.cropTypes || []);
      }
    } catch (err) {
      setError('Failed to load expense data. Please try again.');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDemoData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b9466d4b/admin/refresh-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh data after refresh
        await loadExpenseData();
        alert(`Demo data refreshed successfully!\n${result.message}\nFarmers: ${result.farmers}\nExpenses: ${result.expenses}\nTotal: ₹${result.totalExpenses.toLocaleString()}`);
      } else {
        setError('Failed to refresh demo data');
      }
    } catch (err) {
      setError('Failed to refresh demo data. Please try again.');
      console.error('Error refreshing demo data:', err);
    } finally {
      setLoading(false);
    }
  };



  const calculateAverageExpensePerKg = () => {
    if (filteredExpenses.length === 0) return 0;
    
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.totalExpenses, 0);
    const totalArea = filteredExpenses.reduce((sum, exp) => sum + exp.farmSize, 0);
    
    return totalArea > 0 ? totalExpenses / totalArea : 0;
  };

  const getExpenseBreakdown = () => {
    if (filteredExpenses.length === 0) return {};
    
    const breakdown = {
      seeds: 0,
      fertilizer: 0,
      pesticides: 0,
      labor: 0,
      irrigation: 0,
      machinery: 0,
      transportation: 0,
      storage: 0,
      other: 0
    };

    filteredExpenses.forEach(exp => {
      Object.keys(breakdown).forEach(key => {
        breakdown[key] += exp.expenses[key] || 0;
      });
    });

    return breakdown;
  };

  const getFarmersBySelectedCrop = () => {
    const farmers = {};
    filteredExpenses.forEach(exp => {
      if (!farmers[exp.farmerId]) {
        farmers[exp.farmerId] = {
          farmerId: exp.farmerId,
          farmerName: exp.farmerName,
          submissions: [],
          totalExpenses: 0,
          totalArea: 0
        };
      }
      
      farmers[exp.farmerId].submissions.push(exp);
      farmers[exp.farmerId].totalExpenses += exp.totalExpenses;
      farmers[exp.farmerId].totalArea += exp.farmSize;
    });

    return Object.values(farmers);
  };

  const toggleFarmerExpansion = (farmerId: string) => {
    setExpandedFarmers(prev => 
      prev.includes(farmerId) 
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const expenseBreakdown = getExpenseBreakdown();
  const averageExpensePerAcre = calculateAverageExpensePerKg();
  const farmerGroups = getFarmersBySelectedCrop();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading expense data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Monitor farmer expenses and agricultural analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={refreshDemoData} 
            disabled={loading} 
            variant="outline"
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Demo Data (92 Farmers)
          </Button>
          <Badge variant="outline" className="px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            Live Data
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}



      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Farmers</p>
                <p className="text-2xl font-semibold">{new Set(expenses.map(e => e.farmerId)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BarChart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Crop Types</p>
                <p className="text-2xl font-semibold">{cropTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-semibold">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <IndianRupee className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Cost/Acre</p>
                <p className="text-2xl font-semibold">₹{averageExpensePerAcre.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Expense Overview</TabsTrigger>
          <TabsTrigger value="crops">By Crop Analysis</TabsTrigger>
          <TabsTrigger value="farmers">Farmer Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Crop Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Filter by Crop Type</CardTitle>
              <CardDescription>
                Select a specific crop to view detailed expense analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCrop || 'all'} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="All crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {cropTypes.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCrop && selectedCrop !== 'all' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing data for <strong>{selectedCrop}</strong> - {filteredExpenses.length} submissions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  {selectedCrop && selectedCrop !== 'all' ? `Distribution for ${selectedCrop}` : 'Total across all crops'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(expenseBreakdown).map(([category, amount]) => {
                    const total = Object.values(expenseBreakdown).reduce((sum, val) => sum + val, 0);
                    const percentage = total > 0 ? (amount / total) * 100 : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${Object.keys(expenseBreakdown).indexOf(category) * 40}, 70%, 50%)` }}
                          />
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>
                  {selectedCrop && selectedCrop !== 'all' ? `Metrics for ${selectedCrop}` : 'Overall metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Average Cost per Acre</span>
                    <span className="font-semibold">₹{averageExpensePerAcre.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Total Farm Area</span>
                    <span className="font-semibold">
                      {filteredExpenses.reduce((sum, exp) => sum + exp.farmSize, 0)} acres
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Total Expenses</span>
                    <span className="font-semibold">
                      ₹{filteredExpenses.reduce((sum, exp) => sum + exp.totalExpenses, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Number of Farmers</span>
                    <span className="font-semibold">{farmerGroups.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop-wise Expense Analysis</CardTitle>
              <CardDescription>
                Compare expenses across different crop types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropTypes.map(crop => {
                  const cropExpenses = expenses.filter(exp => exp.cropType === crop);
                  const totalCost = cropExpenses.reduce((sum, exp) => sum + exp.totalExpenses, 0);
                  const totalArea = cropExpenses.reduce((sum, exp) => sum + exp.farmSize, 0);
                  const avgCostPerAcre = totalArea > 0 ? totalCost / totalArea : 0;
                  
                  return (
                    <div key={crop} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{crop}</h4>
                        <Badge variant="outline">{cropExpenses.length} submissions</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Area</p>
                          <p className="font-medium">{totalArea} acres</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Cost</p>
                          <p className="font-medium">₹{totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Cost/Acre</p>
                          <p className="font-medium">₹{avgCostPerAcre.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Farmers</p>
                          <p className="font-medium">{new Set(cropExpenses.map(e => e.farmerId)).size}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Expense Details</CardTitle>
              <CardDescription>
                {selectedCrop && selectedCrop !== 'all'
                  ? `Farmers growing ${selectedCrop} and their expense details`
                  : 'All farmers and their expense submissions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Crop Filter for Farmers Tab */}
              <div className="mb-6">
                <Select value={selectedCrop || 'all'} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Filter by crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    {cropTypes.map(crop => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {farmerGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Tractor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No farmer data available</h3>
                    <p className="text-muted-foreground">
                      {selectedCrop && selectedCrop !== 'all'
                        ? `No farmers have submitted expenses for ${selectedCrop} yet`
                        : 'No farmers have submitted expense data yet'
                      }
                    </p>
                  </div>
                ) : (
                  farmerGroups.map(farmer => (
                    <div key={farmer.farmerId} className="border rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleFarmerExpansion(farmer.farmerId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Tractor className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-semibold">{farmer.farmerName}</h4>
                              <p className="text-sm text-muted-foreground">ID: {farmer.farmerId}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">₹{farmer.totalExpenses.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {farmer.totalArea} acres • {farmer.submissions.length} submissions
                              </p>
                            </div>
                            {expandedFarmers.includes(farmer.farmerId) ? 
                              <ChevronUp className="h-5 w-5" /> : 
                              <ChevronDown className="h-5 w-5" />
                            }
                          </div>
                        </div>
                      </div>

                      {expandedFarmers.includes(farmer.farmerId) && (
                        <div className="border-t bg-muted/25">
                          <div className="p-4 space-y-4">
                            {farmer.submissions.map(submission => (
                              <div key={submission.id} className="bg-background rounded p-3 border">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium">{submission.cropType}</h5>
                                  <Badge variant="outline">{submission.season}</Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                  <div>
                                    <p className="text-muted-foreground">Farm Size</p>
                                    <p className="font-medium">{submission.farmSize} acres</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Total Cost</p>
                                    <p className="font-medium">₹{submission.totalExpenses.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Cost/Acre</p>
                                    <p className="font-medium">₹{submission.expensePerAcre.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Submitted</p>
                                    <p className="font-medium">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  {Object.entries(submission.expenses).map(([category, amount]) => (
                                    amount > 0 && (
                                      <div key={category} className="flex justify-between p-2 bg-muted rounded">
                                        <span className="capitalize">{category}:</span>
                                        <span>₹{amount.toLocaleString()}</span>
                                      </div>
                                    )
                                  ))}
                                </div>

                                {submission.notes && (
                                  <div className="mt-3">
                                    <p className="text-sm text-muted-foreground">Notes:</p>
                                    <p className="text-sm bg-muted p-2 rounded">{submission.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}