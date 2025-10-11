import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QrCode, Camera, X, Scan, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function QRScanner({ onScanResult, onCancel }) {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when component mounts and scanning mode is active
  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      setScannerError('');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScannerError('Camera access is not supported in this browser. Please use manual entry.');
        setCameraActive(false);
        return;
      }
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use rear camera on mobile devices
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      let errorMessage = 'Unable to access camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera is not supported in this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'An unknown error occurred. Please try manual entry.';
      }
      
      setScannerError(errorMessage);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Simulate QR code detection (in real implementation, you'd use a QR scanning library)
  const simulateQRScan = () => {
    // For demo purposes, simulate finding different batch IDs
    const demoQRCodes = [
      'https://agritrace.app/scan/BATCH-1704812345678',
      'https://agritrace.app/scan/BATCH-1704812345679',
      'https://agritrace.app/scan/BATCH-1704812345680'
    ];
    
    const randomQR = demoQRCodes[Math.floor(Math.random() * demoQRCodes.length)];
    stopCamera();
    setTimeout(() => {
      onScanResult(randomQR);
    }, 1000);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      setError('Please enter a batch ID or QR URL');
      return;
    }
    
    setError('');
    // Process manual input
    let qrData = manualInput.trim();
    
    // If it's just a batch ID, convert to full URL
    if (!qrData.startsWith('http')) {
      qrData = `https://agritrace.app/scan/${qrData}`;
    }
    
    onScanResult(qrData);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  if (isScanning) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Scanner
          </CardTitle>
          <CardDescription>
            Point your camera at the QR code on the product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {cameraActive ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="relative">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center animate-pulse">
                      <QrCode className="h-12 w-12 text-white/60" />
                    </div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-ping opacity-60"></div>
                  </div>
                  <p className="mt-4 text-sm text-white/80">
                    {scannerError ? 'Camera unavailable' : 'Initializing camera...'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Corner indicators - only show when camera is active */}
            {cameraActive && (
              <>
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-1 bg-green-500 animate-pulse"></div>
                </div>
              </>
            )}
          </div>
          
          {/* Scanner Error Alert */}
          {scannerError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{scannerError}</p>
                  {scannerError.includes('permission was denied') && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">To enable camera access:</p>
                      <div className="bg-muted/50 p-3 rounded space-y-2">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="font-medium">Browser Settings:</span>
                        </div>
                        <ul className="list-disc list-inside ml-6 space-y-1 text-xs">
                          <li>Click the camera icon in your browser's address bar</li>
                          <li>Select "Allow" for camera permissions</li>
                          <li>Or go to site settings and enable camera access</li>
                        </ul>
                        <div className="flex items-center gap-2 mt-2">
                          <RefreshCw className="h-4 w-4" />
                          <span className="font-medium">Then refresh and try again</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            {cameraActive ? (
              <Button onClick={simulateQRScan} className="flex-1">
                <Scan className="h-4 w-4 mr-2" />
                Detect QR Code
              </Button>
            ) : (
              <>
                <Button onClick={startCamera} className="flex-1" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  {scannerError ? 'Try Again' : 'Enable Camera'}
                </Button>
                {scannerError && scannerError.includes('permission was denied') && (
                  <Button onClick={() => window.location.reload()} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                )}
              </>
            )}
            <Button variant="outline" onClick={() => setIsScanning(false)} className="flex-1">
              Manual Entry
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Alert>
            <Camera className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Camera Access:</strong> This app uses your device's camera to scan QR codes.</p>
                {!cameraActive && !scannerError && (
                  <p className="text-sm">Grant camera permission when prompted for the best experience, or use manual entry as an alternative.</p>
                )}
                {cameraActive && (
                  <p className="text-sm text-green-600">✓ Camera is active. Position the QR code within the frame to scan.</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Manual Entry
        </CardTitle>
        <CardDescription>
          Enter the batch ID or QR code URL manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter Batch ID (e.g., BATCH-1704812345678) or QR URL"
            value={manualInput}
            onChange={(e) => {
              setManualInput(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>You can enter:</p>
          <ul className="list-disc list-inside ml-2">
            <li>Batch ID: BATCH-1704812345678</li>
            <li>Full QR URL: https://agritrace.app/scan/BATCH-1704812345678</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleManualSubmit} className="flex-1">
            Lookup Batch
          </Button>
          <Button variant="outline" onClick={() => setIsScanning(true)}>
            <Camera className="h-4 w-4 mr-2" />
            Use Camera
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}