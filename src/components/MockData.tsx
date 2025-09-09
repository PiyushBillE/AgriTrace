// Mock data for demonstration purposes
// In production, this would come from blockchain and backend APIs

export const mockBatches = [
  {
    id: 'BATCH-1704812345678',
    farmer: 'Ramesh Kumar',
    farmerId: '0x742d35Cc67890F1B7D9A98e3F47cA6542732D8b1',
    cropType: 'Organic Tomatoes',
    quantity: 500,
    harvestDate: '2024-12-15',
    location: 'Nashik, Maharashtra',
    basePrice: 35,
    retailPrice: 45,
    status: 'Transferred',
    currentOwner: 'FreshMart Supermarket',
    certifications: ['Organic', 'FSSAI Certified'],
    expenses: {
      seeds: 2000,
      fertilizer: 3500,
      labor: 8000,
      other: 1500
    },
    createDate: '2024-12-15T08:30:00Z',
    txHash: '0xa1b2c3d4...',
    qrCode: 'https://agritrace.app/scan/BATCH-1704812345678',
    history: [
      {
        actor: 'Ramesh Kumar',
        action: 'created',
        timestamp: '2024-12-15T08:30:00Z',
        location: 'Nashik, Maharashtra'
      },
      {
        actor: 'Green Valley Distributors',
        action: 'transferred',
        timestamp: '2024-12-16T14:20:00Z',
        location: 'Distribution Center'
      },
      {
        actor: 'FreshMart Supermarket',
        action: 'retail_received',
        timestamp: '2024-12-17T10:15:00Z',
        location: 'Main Street Store'
      }
    ]
  },
  {
    id: 'BATCH-1704812345679',
    farmer: 'Ramesh Kumar',
    farmerId: '0x742d35Cc67890F1B7D9A98e3F47cA6542732D8b1',
    cropType: 'Basmati Rice',
    quantity: 2000,
    harvestDate: '2024-12-10',
    location: 'Karnal, Haryana',
    basePrice: 25,
    retailPrice: null,
    status: 'Created',
    currentOwner: 'Ramesh Kumar',
    certifications: ['Premium Grade', 'Export Quality'],
    expenses: {
      seeds: 5000,
      fertilizer: 8000,
      labor: 15000,
      other: 3000
    },
    createDate: '2024-12-10T06:45:00Z',
    txHash: '0xb2c3d4e5...',
    qrCode: 'https://agritrace.app/scan/BATCH-1704812345679',
    history: [
      {
        actor: 'Ramesh Kumar',
        action: 'created',
        timestamp: '2024-12-10T06:45:00Z',
        location: 'Karnal, Haryana'
      }
    ]
  },
  {
    id: 'BATCH-1704812345680',
    farmer: 'Priya Sharma',
    farmerId: '0x8E3F47cA6542732D8b1742d35Cc67890F1B7D9A9',
    cropType: 'Red Onions',
    quantity: 800,
    harvestDate: '2024-12-12',
    location: 'Pune, Maharashtra',
    basePrice: 20,
    retailPrice: 28,
    status: 'Transferred',
    currentOwner: 'Green Valley Distributors',
    certifications: ['Pesticide-Free'],
    expenses: {
      seeds: 1200,
      fertilizer: 2800,
      labor: 5000,
      other: 800
    },
    createDate: '2024-12-12T09:15:00Z',
    txHash: '0xc3d4e5f6...',
    qrCode: 'https://agritrace.app/scan/BATCH-1704812345680',
    history: [
      {
        actor: 'Priya Sharma',
        action: 'created',
        timestamp: '2024-12-12T09:15:00Z',
        location: 'Pune, Maharashtra'
      },
      {
        actor: 'Green Valley Distributors',
        action: 'transferred',
        timestamp: '2024-12-13T16:30:00Z',
        location: 'Distribution Center'
      }
    ]
  },
  {
    id: 'BATCH-1704812345681',
    farmer: 'Suresh Patel',
    farmerId: '0x7D9A98e3F47cA6542732D8b1742d35Cc67890F1B',
    cropType: 'Green Chilies',
    quantity: 150,
    harvestDate: '2024-12-14',
    location: 'Guntur, Andhra Pradesh',
    basePrice: 60,
    retailPrice: null,
    status: 'Listed',
    currentOwner: 'Suresh Patel',
    certifications: ['Spice Board Certified', 'High Quality'],
    expenses: {
      seeds: 800,
      fertilizer: 1500,
      labor: 3000,
      other: 500
    },
    createDate: '2024-12-14T11:20:00Z',
    txHash: '0xd4e5f6g7...',
    qrCode: 'https://agritrace.app/scan/BATCH-1704812345681',
    history: [
      {
        actor: 'Suresh Patel',
        action: 'created',
        timestamp: '2024-12-14T11:20:00Z',
        location: 'Guntur, Andhra Pradesh'
      }
    ]
  },
  {
    id: 'BATCH-1704812345682',
    farmer: 'Lakshmi Reddy',
    farmerId: '0x98e3F47cA6542732D8b1742d35Cc67890F1B7D9A',
    cropType: 'Organic Spinach',
    quantity: 100,
    harvestDate: '2024-12-16',
    location: 'Belgaum, Karnataka',
    basePrice: 40,
    retailPrice: 52,
    status: 'In Transit',
    currentOwner: 'Green Valley Distributors',
    certifications: ['Organic', 'Fresh Grade A'],
    expenses: {
      seeds: 600,
      fertilizer: 0, // Organic
      labor: 2500,
      other: 400
    },
    createDate: '2024-12-16T07:00:00Z',
    txHash: '0xe5f6g7h8...',
    qrCode: 'https://agritrace.app/scan/BATCH-1704812345682',
    history: [
      {
        actor: 'Lakshmi Reddy',
        action: 'created',
        timestamp: '2024-12-16T07:00:00Z',
        location: 'Belgaum, Karnataka'
      },
      {
        actor: 'Green Valley Distributors',
        action: 'transferred',
        timestamp: '2024-12-17T08:45:00Z',
        location: 'Distribution Center'
      }
    ]
  }
];

export const mockTransactions = [
  {
    id: 'TX-001',
    batchId: 'BATCH-1704812345678',
    type: 'batch_creation',
    actor: 'Ramesh Kumar',
    txHash: '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    timestamp: '2024-12-15T08:30:00Z',
    gasUsed: 120000,
    status: 'confirmed'
  },
  {
    id: 'TX-002',
    batchId: 'BATCH-1704812345678',
    type: 'ownership_transfer',
    actor: 'Green Valley Distributors',
    txHash: '0xb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1',
    timestamp: '2024-12-16T14:20:00Z',
    gasUsed: 85000,
    status: 'confirmed'
  },
  {
    id: 'TX-003',
    batchId: 'BATCH-1704812345678',
    type: 'price_update',
    actor: 'FreshMart Supermarket',
    txHash: '0xc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2',
    timestamp: '2024-12-17T10:15:00Z',
    gasUsed: 65000,
    status: 'confirmed'
  },
  {
    id: 'TX-004',
    batchId: 'BATCH-1704812345679',
    type: 'batch_creation',
    actor: 'Ramesh Kumar',
    txHash: '0xd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3',
    timestamp: '2024-12-10T06:45:00Z',
    gasUsed: 118000,
    status: 'confirmed'
  },
  {
    id: 'TX-005',
    batchId: 'BATCH-1704812345680',
    type: 'batch_creation',
    actor: 'Priya Sharma',
    txHash: '0xe5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4',
    timestamp: '2024-12-12T09:15:00Z',
    gasUsed: 125000,
    status: 'confirmed'
  },
  {
    id: 'TX-006',
    batchId: 'BATCH-1704812345680',
    type: 'quality_verification',
    actor: 'Green Valley Distributors',
    txHash: '0xf6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5',
    timestamp: '2024-12-13T16:30:00Z',
    gasUsed: 75000,
    status: 'confirmed'
  },
  {
    id: 'TX-007',
    batchId: 'BATCH-1704812345681',
    type: 'batch_creation',
    actor: 'Suresh Patel',
    txHash: '0xg7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5f6',
    timestamp: '2024-12-14T11:20:00Z',
    gasUsed: 122000,
    status: 'confirmed'
  },
  {
    id: 'TX-008',
    batchId: 'BATCH-1704812345682',
    type: 'batch_creation',
    actor: 'Lakshmi Reddy',
    txHash: '0xh8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5f6g7',
    timestamp: '2024-12-16T07:00:00Z',
    gasUsed: 119000,
    status: 'confirmed'
  },
  {
    id: 'TX-009',
    batchId: 'BATCH-1704812345682',
    type: 'ownership_transfer',
    actor: 'Green Valley Distributors',
    txHash: '0xi9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5f6g7h8',
    timestamp: '2024-12-17T08:45:00Z',
    gasUsed: 88000,
    status: 'confirmed'
  },
  {
    id: 'TX-010',
    batchId: 'BATCH-1704812345678',
    type: 'consumer_scan',
    actor: 'Consumer',
    txHash: '0xj0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5f6g7h8i9',
    timestamp: '2024-12-17T15:30:00Z',
    gasUsed: 25000,
    status: 'confirmed'
  }
];

export const mockMSPRates = {
  rice: 2150,
  wheat: 2275,
  sugarcane: 315,
  cotton: 6080,
  maize: 1850
};

export const mockUsers = {
  farmers: [
    { id: 'farmer-001', name: 'Ramesh Kumar', walletAddress: '0x742d35Cc67890F1B7D9A98e3F47cA6542732D8b1', verified: true },
    { id: 'farmer-002', name: 'Priya Sharma', walletAddress: '0x8E3F47cA6542732D8b1742d35Cc67890F1B7D9A9', verified: true },
    { id: 'farmer-003', name: 'Suresh Patel', walletAddress: '0x7D9A98e3F47cA6542732D8b1742d35Cc67890F1B', verified: true },
    { id: 'farmer-004', name: 'Lakshmi Reddy', walletAddress: '0x98e3F47cA6542732D8b1742d35Cc67890F1B7D9A', verified: true }
  ],
  distributors: [
    { id: 'dist-001', name: 'Green Valley Distributors', walletAddress: '0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', verified: true },
    { id: 'dist-002', name: 'AgriTrans Logistics', walletAddress: '0xB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1', verified: true }
  ],
  retailers: [
    { id: 'retail-001', name: 'FreshMart Supermarket', walletAddress: '0xC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1B2', verified: true },
    { id: 'retail-002', name: 'Organic Foods Store', walletAddress: '0xD4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1B2C3', verified: true }
  ]
};