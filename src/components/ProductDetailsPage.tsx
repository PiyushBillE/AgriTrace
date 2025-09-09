import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Package, MapPin, Calendar, User, CheckCircle, Clock, Truck, Store, Shield, ExternalLink, Copy, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ProductDetailsPageProps {
  productData: any;
  onBack: () => void;
}

export function ProductDetailsPage({ productData, onBack }: ProductDetailsPageProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTransactionId = (txId: string) => {
    return `${txId.slice(0, 10)}...${txId.slice(-8)}`;
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'batch_creation':
        return 'Batch Creation';
      case 'farmer_to_distributor':
        return 'Farmer → Distributor';
      case 'distributor_to_retailer':
        return 'Distributor → Retailer';
      case 'farmer_to_retailer':
        return 'Farmer → Retailer';
      default:
        return 'Unknown Transaction';
    }
  };

  const getStageIcon = (stage: string) => {
    if (stage.includes('Farm')) return Package;
    if (stage.includes('Distributor') || stage.includes('Distribution')) return Truck;
    if (stage.includes('Store') || stage.includes('Retail')) return Store;
    return CheckCircle;
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scanner
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Product Verification Details</h2>
          <p className="text-muted-foreground">Complete blockchain-verified product journey</p>
        </div>
      </div>

      {/* Product Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{productData.cropType}</CardTitle>
              <CardDescription>
                Batch ID: {productData.id}
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Farmer</p>
                <p className="font-medium">{productData.farmer.name}</p>
                <p className="text-xs text-muted-foreground">@{productData.farmer.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium">{productData.farmer.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Harvest Date</p>
                <p className="font-medium">{productData.harvestDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{productData.quantity} kg</p>
              </div>
            </div>
          </div>
          
          {productData.certifications && productData.certifications.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Certifications</p>
              <div className="flex gap-2 flex-wrap">
                {productData.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Transaction History
          </CardTitle>
          <CardDescription>
            All transactions are permanently recorded on the blockchain and cannot be tampered with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productData.blockchainTransactions.map((tx, index) => (
              <div key={tx.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{getTransactionTypeLabel(tx.type)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Block #{tx.blockNumber}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-mono text-sm">{tx.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-mono text-sm">{tx.to}</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded p-3 mb-3">
                  <p className="text-sm">{tx.details}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {formatTransactionId(tx.id)}
                      </code>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(tx.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gas Used</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {tx.gasUsed}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Journey Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Journey</CardTitle>
          <CardDescription>
            Track the complete journey from farm to your table with verified checkpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {productData.journey.map((step, index) => {
              const StageIcon = getStageIcon(step.stage);
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <StageIcon className="h-5 w-5 text-primary" />
                    </div>
                    {index < productData.journey.length - 1 && (
                      <div className="w-px h-8 bg-border ml-5 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{step.stage}</h4>
                      <Badge variant="outline">{step.date}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{step.person}</p>
                        <p className="text-xs text-muted-foreground">@{step.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{step.location}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{step.details}</p>
                    
                    <div className="bg-muted/30 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Blockchain Transaction</p>
                          <code className="text-xs font-mono">
                            {formatTransactionId(step.transactionId)}
                          </code>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(step.transactionId)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Summary */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Verification Complete:</strong> This product has been verified through {productData.blockchainTransactions.length} blockchain transactions. 
          All data is immutable and transparent, ensuring complete traceability from farm to consumer.
        </AlertDescription>
      </Alert>
    </div>
  );
}