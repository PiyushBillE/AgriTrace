import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { QrCode, Download, Printer } from 'lucide-react';
import { Badge } from './ui/badge';

export function QRCodeDisplay({ batchData }) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate QR code URL (in real implementation, use a QR code library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(batchData.qrCode || `https://agritrace.app/scan/${batchData.id}`)}`;

  const handleDownload = () => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-${batchData.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    // Open print dialog with QR code
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${batchData.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              border: 2px solid #000; 
              padding: 20px; 
              display: inline-block; 
              margin: 20px;
            }
            .batch-info { 
              margin-top: 10px; 
              font-size: 12px; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h3>${batchData.cropType}</h3>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="batch-info">
              <p><strong>Batch ID:</strong> ${batchData.id}</p>
              <p><strong>Farmer:</strong> ${batchData.farmer}</p>
              <p><strong>Quantity:</strong> ${batchData.quantity} kg</p>
              <p><strong>Origin:</strong> ${batchData.location}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product QR Code</DialogTitle>
          <DialogDescription>
            QR code for batch {batchData.id}. Consumers can scan this to view the complete product journey.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="border-2 border-muted p-4 rounded-lg bg-white">
              <img 
                src={qrCodeUrl}
                alt={`QR Code for ${batchData.id}`}
                className="w-48 h-48"
              />
            </div>
          </div>
          
          {/* Batch Information */}
          <div className="space-y-2 text-sm bg-muted p-3 rounded">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{batchData.cropType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch ID:</span>
              <span className="font-mono text-xs">{batchData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farmer:</span>
              <span className="font-medium">{batchData.farmer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{batchData.quantity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Origin:</span>
              <span className="font-medium">{batchData.location}</span>
            </div>
          </div>
          
          {/* Certifications */}
          {batchData.certifications && batchData.certifications.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Certifications:</span>
              <div className="flex gap-1 flex-wrap">
                {batchData.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* URL Display */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Scan URL:</span>
            <div className="bg-muted p-2 rounded text-xs font-mono break-all">
              {batchData.qrCode || `https://agritrace.app/scan/${batchData.id}`}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleDownload} className="flex-1" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Label
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}