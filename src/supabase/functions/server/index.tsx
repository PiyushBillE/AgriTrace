import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b9466d4b/health", (c) => {
  return c.json({ status: "ok" });
});

// Batch management endpoints
app.post("/make-server-b9466d4b/batches", async (c) => {
  try {
    const batchData = await c.req.json();

    // Generate unique batch ID
    const batchId = `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add metadata
    const batch = {
      ...batchData,
      id: batchId,
      createdAt: new Date().toISOString(),
      status: "Created",
      txHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
      qrCode: `https://agritrace.app/scan/${batchId}`,
    };

    // Save to database
    await kv.set(`batch:${batchId}`, batch);
    await kv.set(
      `user_batches:${batchData.farmerId}:${batchId}`,
      batch,
    );

    console.log(
      `Batch created: ${batchId} for farmer: ${batchData.farmerId}`,
    );

    return c.json({ success: true, batch });
  } catch (error) {
    console.error("Error creating batch:", error);
    return c.json({ error: "Failed to create batch" }, 500);
  }
});

// Get batches for a user
app.get("/make-server-b9466d4b/batches/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const batches = await kv.getByPrefix(
      `user_batches:${userId}:`,
    );

    return c.json({ success: true, batches: batches || [] });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return c.json({ error: "Failed to fetch batches" }, 500);
  }
});

// Get single batch by ID
app.get("/make-server-b9466d4b/batch/:batchId", async (c) => {
  try {
    const batchId = c.req.param("batchId");
    const batch = await kv.get(`batch:${batchId}`);

    if (!batch) {
      return c.json({ error: "Batch not found" }, 404);
    }

    return c.json({ success: true, batch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    return c.json({ error: "Failed to fetch batch" }, 500);
  }
});

// Transfer batch ownership (distributor accepting from farmer, retailer from distributor)
app.post(
  "/make-server-b9466d4b/batches/:batchId/transfer",
  async (c) => {
    try {
      const batchId = c.req.param("batchId");
      const transferData = await c.req.json();

      // Get existing batch
      const batch = await kv.get(`batch:${batchId}`);
      if (!batch) {
        return c.json({ error: "Batch not found" }, 404);
      }

      // Create transfer record
      const transfer = {
        id: `TRANSFER-${Date.now()}`,
        batchId,
        from: batch.currentOwner || batch.farmerId,
        to: transferData.newOwnerId,
        transferData: transferData.metadata,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
        type: transferData.type || "ownership_transfer",
      };

      // Update batch with new owner and transfer data
      const updatedBatch = {
        ...batch,
        currentOwner: transferData.newOwnerId,
        status: transferData.status || "Transferred",
        lastTransfer: transfer,
        transferHistory: [
          ...(batch.transferHistory || []),
          transfer,
        ],
      };

      // Save updated batch and transfer record
      await kv.set(`batch:${batchId}`, updatedBatch);
      await kv.set(`transfer:${transfer.id}`, transfer);
      await kv.set(
        `user_batches:${transferData.newOwnerId}:${batchId}`,
        updatedBatch,
      );

      console.log(
        `Batch ${batchId} transferred from ${transfer.from} to ${transfer.to}`,
      );

      return c.json({
        success: true,
        transfer,
        batch: updatedBatch,
      });
    } catch (error) {
      console.error("Error transferring batch:", error);
      return c.json({ error: "Failed to transfer batch" }, 500);
    }
  },
);

// Get user profile
app.get("/make-server-b9466d4b/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await kv.get(`user:${userId}`);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Update user profile
app.put("/make-server-b9466d4b/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const updateData = await c.req.json();

    const existingUser = await kv.get(`user:${userId}`);
    if (!existingUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedUser = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Farmer expense tracking endpoints
app.post("/make-server-b9466d4b/expenses", async (c) => {
  try {
    const expenseData = await c.req.json();
    
    // Generate unique expense ID
    const expenseId = `EXPENSE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add metadata
    const expense = {
      ...expenseData,
      id: expenseId,
      createdAt: new Date().toISOString(),
      status: "Submitted"
    };
    
    // Save to database
    await kv.set(`expense:${expenseId}`, expense);
    await kv.set(`farmer_expenses:${expenseData.farmerId}:${expenseId}`, expense);
    await kv.set(`crop_expenses:${expenseData.cropType}:${expenseId}`, expense);
    
    console.log(`Expense created: ${expenseId} for farmer: ${expenseData.farmerId}`);
    
    return c.json({ success: true, expense });
  } catch (error) {
    console.error("Error creating expense:", error);
    return c.json({ error: "Failed to create expense" }, 500);
  }
});

// Get all farmer expenses
app.get("/make-server-b9466d4b/admin/expenses", async (c) => {
  try {
    let expenses = await kv.getByPrefix("expense:");
    
    // Auto-initialize demo data if no expenses exist
    if (!expenses || expenses.length === 0) {
      console.log("No expenses found, initializing demo data...");
      await initializeDemoData();
      expenses = await kv.getByPrefix("expense:");
    }
    
    return c.json({ success: true, expenses: expenses || [] });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
});

// Get expenses by crop type
app.get("/make-server-b9466d4b/admin/expenses/crop/:cropType", async (c) => {
  try {
    const cropType = c.req.param("cropType");
    const expenses = await kv.getByPrefix(`crop_expenses:${cropType}:`);
    return c.json({ success: true, expenses: expenses || [] });
  } catch (error) {
    console.error("Error fetching crop expenses:", error);
    return c.json({ error: "Failed to fetch crop expenses" }, 500);
  }
});

// Get farmer expense summary
app.get("/make-server-b9466d4b/admin/farmers/:farmerId/expenses", async (c) => {
  try {
    const farmerId = c.req.param("farmerId");
    const expenses = await kv.getByPrefix(`farmer_expenses:${farmerId}:`);
    return c.json({ success: true, expenses: expenses || [] });
  } catch (error) {
    console.error("Error fetching farmer expenses:", error);
    return c.json({ error: "Failed to fetch farmer expenses" }, 500);
  }
});

// Get unique crop types for admin filtering
app.get("/make-server-b9466d4b/admin/crop-types", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");
    const cropTypes = [...new Set(expenses.map(exp => exp.cropType))];
    return c.json({ success: true, cropTypes: cropTypes || [] });
  } catch (error) {
    console.error("Error fetching crop types:", error);
    return c.json({ error: "Failed to fetch crop types" }, 500);
  }
});

// Generate fresh demo expense data for 92 farmers  
const generateFreshDemoData = async () => {

    const cropTypes = [
      { name: "Basmati Rice", category: "Cereals", avgCostPerAcre: 30000 },
      { name: "Wheat", category: "Cereals", avgCostPerAcre: 28000 },
      { name: "Maize", category: "Cereals", avgCostPerAcre: 35000 },
      { name: "Tomatoes", category: "Vegetables", avgCostPerAcre: 40000 },
      { name: "Onions", category: "Vegetables", avgCostPerAcre: 30000 },
      { name: "Potatoes", category: "Vegetables", avgCostPerAcre: 45000 },
      { name: "Cotton", category: "Cash Crops", avgCostPerAcre: 40000 },
      { name: "Sugarcane", category: "Cash Crops", avgCostPerAcre: 50000 },
      { name: "Jowar", category: "Millets", avgCostPerAcre: 18000 },
      { name: "Bajra", category: "Millets", avgCostPerAcre: 18000 },
      { name: "Mustard", category: "Oilseeds", avgCostPerAcre: 30000 },
      { name: "Sunflower", category: "Oilseeds", avgCostPerAcre: 32000 },
      { name: "Mangoes", category: "Fruits", avgCostPerAcre: 40000 },
      { name: "Grapes", category: "Fruits", avgCostPerAcre: 80000 },
      { name: "Oranges", category: "Fruits", avgCostPerAcre: 35000 },
      { name: "Cabbage", category: "Vegetables", avgCostPerAcre: 35000 },
      { name: "Cauliflower", category: "Vegetables", avgCostPerAcre: 38000 },
      { name: "Carrots", category: "Vegetables", avgCostPerAcre: 33000 },
      { name: "Chillies", category: "Spices", avgCostPerAcre: 42000 },
      { name: "Turmeric", category: "Spices", avgCostPerAcre: 38000 }
    ];

    const seasons = ["Kharif 2024", "Rabi 2024", "Summer 2024", "Annual 2024", "Perennial 2024"];
    const regions = ["Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Tamil Nadu"];
    
    const farmerNames = [
      "Rajesh Kumar", "Priya Sharma", "Suresh Patel", "Meera Devi", "Vikram Singh", "Anjali Reddy",
      "Ramesh Gupta", "Sunita Yadav", "Mahesh Verma", "Kavita Singh", "Amit Joshi", "Ritu Agarwal",
      "Deepak Sharma", "Neha Kumari", "Sanjay Tiwari", "Pooja Mishra", "Rakesh Jain", "Seema Saxena",
      "Gopal Krishna", "Urmila Devi", "Harish Chandra", "Madhuri Joshi", "Vinod Kumar", "Shobha Rani",
      "Dinesh Chand", "Parvati Devi", "Ramesh Babu", "Lakshmi Naidu", "Sunil Reddy", "Padma Kumari",
      "Anil Desai", "Jayshree Patel", "Kiran Rao", "Sudha Nair", "Ravi Shankar", "Geeta Devi",
      "Mohan Lal", "Sushila Bai", "Balram Singh", "Kamala Devi", "Narayan Das", "Saraswati Devi",
      "Bharat Singh", "Radha Rani", "Shyam Sunder", "Pramila Devi", "Jagdish Prasad", "Anita Kumari",
      "Ramchandra", "Savitri Devi", "Krishnan Nair", "Vasantha Devi", "Subhash Goud", "Yellamma",
      "Raman Pillai", "Kamakshi Amma", "Venkatesh Rao", "Nagamani", "Rajesh Babu", "Shanti Devi",
      "Murugan", "Meenakshi", "Selvam", "Kalpana", "Balasubramanian", "Janaki", "Thangavel", "Rukmani",
      "Arjun Singh", "Pushpa Devi", "Satish Kumar", "Usha Rani", "Praveen Sharma", "Nirmala Devi",
      "Yogesh Patel", "Manju Devi", "Ashok Kumar", "Laxmi Bai", "Naresh Gupta", "Vidya Devi",
      "Mahender Singh", "Saroj Devi", "Kamlesh Yadav", "Santosh Kumari", "Brijesh Kumar", "Rashni Devi",
      "Devendra Prasad", "Sunanda Devi", "Lokesh Sharma", "Poonam Kumari", "Ramesh Chand", "Sita Devi",
      "Prakash Rao", "Indira Devi", "Ganesh Prasad", "Rekha Devi", "Sureshbabu Naik", "Vimala Kumari",
      "Dharamveer Singh", "Renu Devi", "Kishore Kumar", "Shyama Devi", "Radheshyam", "Kiran Devi"
    ];

    const demoExpenses = [];
    let expenseCounter = 1;

    // Generate data for 92 farmers
    for (let farmerId = 1; farmerId <= 92; farmerId++) {
      const farmerName = farmerNames[(farmerId - 1) % farmerNames.length]; // Cycle through names if we run out
      const numCrops = Math.floor(Math.random() * 3) + 1; // 1-3 crops per farmer

      for (let cropIndex = 0; cropIndex < numCrops; cropIndex++) {
        const crop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
        const season = seasons[Math.floor(Math.random() * seasons.length)];
        const farmSize = parseFloat((Math.random() * 9 + 0.5).toFixed(1)); // 0.5 to 9.5 acres
        
        // Calculate expenses with some randomness
        const baseCost = crop.avgCostPerAcre * farmSize;
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        const totalExpenses = Math.round(baseCost * (1 + variation));
        const expensePerAcre = Math.round(totalExpenses / farmSize);

        // Generate realistic expense breakdown
        const seedsPercent = crop.category === "Fruits" ? 0 : Math.random() * 0.15 + 0.10; // 10-25% for non-fruits
        const fertilizerPercent = Math.random() * 0.15 + 0.25; // 25-40%
        const pesticidesPercent = Math.random() * 0.10 + 0.10; // 10-20%
        const laborPercent = Math.random() * 0.15 + 0.25; // 25-40%
        const irrigationPercent = Math.random() * 0.10 + 0.10; // 10-20%
        const machineryPercent = Math.random() * 0.08 + 0.02; // 2-10%
        const transportationPercent = Math.random() * 0.03 + 0.01; // 1-4%
        const storagePercent = Math.random() * 0.02 + 0.005; // 0.5-2.5%

        const expenses = {
          seeds: Math.round(totalExpenses * seedsPercent),
          fertilizer: Math.round(totalExpenses * fertilizerPercent),
          pesticides: Math.round(totalExpenses * pesticidesPercent),
          labor: Math.round(totalExpenses * laborPercent),
          irrigation: Math.round(totalExpenses * irrigationPercent),
          machinery: Math.round(totalExpenses * machineryPercent),
          transportation: Math.round(totalExpenses * transportationPercent),
          storage: Math.round(totalExpenses * storagePercent),
          other: 0
        };

        // Adjust total to match
        const calculatedTotal = Object.values(expenses).reduce((sum, val) => sum + val, 0);
        expenses.fertilizer += (totalExpenses - calculatedTotal);

        const notes = [
          `${crop.category === "Cereals" ? "High yielding variety" : 
            crop.category === "Vegetables" ? "Fresh market quality" :
            crop.category === "Cash Crops" ? "Commercial grade production" :
            crop.category === "Fruits" ? "Premium fruit cultivation" :
            crop.category === "Millets" ? "Drought resistant variety" :
            crop.category === "Oilseeds" ? "Oil extraction quality" :
            "Quality focused cultivation"}`,
          `${Math.random() > 0.5 ? "Organic farming practices" : "Conventional farming methods"}`,
          `${Math.random() > 0.7 ? "Contract farming" : "Open market"}`,
          `${Math.random() > 0.8 ? "Certified seeds used" : "Traditional variety"}`,
          `${Math.random() > 0.6 ? "Drip irrigation system" : "Flood irrigation method"}`
        ];

        const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        
        const expense = {
          id: `EXPENSE-DEMO-${String(expenseCounter).padStart(3, '0')}`,
          farmerId: `FARMER-${String(farmerId).padStart(3, '0')}`,
          farmerName: farmerName,
          cropType: crop.name,
          cropCategory: crop.category,
          season: season,
          farmSize: farmSize,
          totalExpenses: totalExpenses,
          expensePerAcre: expensePerAcre,
          expenses: expenses,
          notes: notes[Math.floor(Math.random() * notes.length)],
          submittedAt: randomDate.toISOString()
        };

        demoExpenses.push(expense);
        expenseCounter++;
      }
    }

    // Store all demo expenses
    for (const expense of demoExpenses) {
      await kv.set(`expense:${expense.id}`, expense);
      await kv.set(`farmer_expenses:${expense.farmerId}:${expense.id}`, expense);
      await kv.set(`crop_expenses:${expense.cropType}:${expense.id}`, expense);
    }

    console.log(`Initialized ${demoExpenses.length} demo expense records for 92 farmers`);
    const uniqueFarmers = [...new Set(demoExpenses.map(e => e.farmerId))];
    console.log(`Unique farmers created: ${uniqueFarmers.length}`);
    
    return {
      success: true,
      message: `${demoExpenses.length} expense records created for ${uniqueFarmers.length} farmers`,
      farmers: uniqueFarmers.length,
      expenses: demoExpenses.length,
      crops: [...new Set(demoExpenses.map(e => e.cropType))],
      totalExpenses: demoExpenses.reduce((sum, e) => sum + e.totalExpenses, 0)
    };
};

const initializeDemoData = async () => {
  try {
    // Check if demo data already exists
    const existingExpenses = await kv.getByPrefix("expense:");
    if (existingExpenses && existingExpenses.length > 0) {
      console.log(`Demo data already initialized with ${existingExpenses.length} records`);
      const uniqueFarmers = [...new Set(existingExpenses.map(e => e.farmerId))];
      console.log(`Unique farmers: ${uniqueFarmers.length}`);
      return {
        success: true,
        message: "Demo data already exists",
        farmers: uniqueFarmers.length,
        expenses: existingExpenses.length,
        totalExpenses: existingExpenses.reduce((sum, e) => sum + e.totalExpenses, 0)
      };
    }
    
    // Generate fresh demo data
    return await generateFreshDemoData();
  } catch (error) {
    console.error("Error initializing demo data:", error);
    throw error;
  }
};

// Manual initialization endpoint for admin
app.post("/make-server-b9466d4b/admin/init-demo", async (c) => {
  try {
    const result = await initializeDemoData();
    return c.json(result);
  } catch (error) {
    console.error("Error in manual demo initialization:", error);
    return c.json({ error: "Failed to initialize demo data" }, 500);
  }
});

// Force refresh demo data endpoint 
app.post("/make-server-b9466d4b/admin/refresh-demo", async (c) => {
  try {
    // First clear existing demo data
    const existingExpenses = await kv.getByPrefix("expense:");
    console.log(`Clearing ${existingExpenses.length} existing expense records`);
    
    for (const expense of existingExpenses) {
      await kv.del(`expense:${expense.id}`);
      await kv.del(`farmer_expenses:${expense.farmerId}:${expense.id}`);
      await kv.del(`crop_expenses:${expense.cropType}:${expense.id}`);
    }
    
    // Clear any other farmer or crop data
    const farmerData = await kv.getByPrefix("farmer_expenses:");
    for (const data of farmerData) {
      await kv.del(`farmer_expenses:${data.farmerId}:${data.id}`);
    }
    
    const cropData = await kv.getByPrefix("crop_expenses:");
    for (const data of cropData) {
      await kv.del(`crop_expenses:${data.cropType}:${data.id}`);
    }
    
    console.log("Existing data cleared, generating fresh demo data...");
    
    // Now generate fresh demo data
    const result = await generateFreshDemoData();
    return c.json(result);
  } catch (error) {
    console.error("Error refreshing demo data:", error);
    return c.json({ error: "Failed to refresh demo data" }, 500);
  }
});

const generateFreshDemoData = async () => {

// Auto-initialize demo data on server startup
(async () => {
  try {
    console.log("Server starting, checking for demo data...");
    await initializeDemoData();
    console.log("Demo data initialization completed");
  } catch (error) {
    console.error("Failed to initialize demo data on startup:", error);
  }
})();

// Get demo QR code data
app.get("/make-server-b9466d4b/demo/qr/:qrId", async (c) => {
  try {
    const qrId = c.req.param("qrId");

    // Demo QR codes with sample data
    const demoQRData = {
      DEMO001: {
        id: "BATCH-DEMO001",
        cropType: "Basmati Rice",
        quantity: 1000,
        harvestDate: "2024-01-15",
        farmer: "Demo Farmer - Rajesh Kumar",
        farmLocation: "Punjab, India",
        certifications: ["Organic", "Non-GMO"],
        currentOwner: "Distributor",
        status: "In Transit",
        qrCode: "DEMO001",
        journey: [
          {
            stage: "Farm",
            location: "Punjab, India",
            date: "2024-01-15",
            person: "Rajesh Kumar",
            details: "Harvested from organic farm",
          },
          {
            stage: "Distributor",
            location: "Delhi Warehouse",
            date: "2024-01-18",
            person: "Northern Distributors Ltd",
            details: "Quality checked and stored at 4°C",
          },
          {
            stage: "In Transit",
            location: "En route to Mumbai",
            date: "2024-01-20",
            person: "Transport Partner",
            details: "Refrigerated transport, ETA: 2 days",
          },
        ],
      },
      DEMO002: {
        id: "BATCH-DEMO002",
        cropType: "Organic Tomatoes",
        quantity: 500,
        harvestDate: "2024-01-20",
        farmer: "Demo Farmer - Priya Sharma",
        farmLocation: "Maharashtra, India",
        certifications: ["Organic", "Fair Trade"],
        currentOwner: "Retailer",
        status: "In Store",
        qrCode: "DEMO002",
        journey: [
          {
            stage: "Farm",
            location: "Maharashtra, India",
            date: "2024-01-20",
            person: "Priya Sharma",
            details: "Harvested fresh organic tomatoes",
          },
          {
            stage: "Distributor",
            location: "Mumbai Hub",
            date: "2024-01-21",
            person: "Fresh Foods Distributors",
            details: "Same day processing and dispatch",
          },
          {
            stage: "Retailer",
            location: "Mumbai Supermarket",
            date: "2024-01-22",
            person: "FreshMart Store",
            details: "Available for purchase",
          },
        ],
      },
      DEMO003: {
        id: "BATCH-DEMO003",
        cropType: "Wheat",
        quantity: 2000,
        harvestDate: "2024-01-10",
        farmer: "Demo Farmer - Suresh Patel",
        farmLocation: "Gujarat, India",
        certifications: ["Quality Assured"],
        currentOwner: "Processing",
        status: "Under Processing",
        qrCode: "DEMO003",
        journey: [
          {
            stage: "Farm",
            location: "Gujarat, India",
            date: "2024-01-10",
            person: "Suresh Patel",
            details: "High-quality wheat harvest",
          },
          {
            stage: "Distributor",
            location: "Ahmedabad Warehouse",
            date: "2024-01-12",
            person: "Gujarat Grains Ltd",
            details: "Quality testing completed",
          },
          {
            stage: "Processing",
            location: "Flour Mill",
            date: "2024-01-15",
            person: "Modern Mills Pvt Ltd",
            details: "Being processed into flour",
          },
        ],
      },
    };

    const qrData = demoQRData[qrId];
    if (!qrData) {
      return c.json({ error: "Demo QR code not found" }, 404);
    }

    return c.json({ success: true, data: qrData });
  } catch (error) {
    console.error("Error fetching demo QR data:", error);
    return c.json({ error: "Failed to fetch demo data" }, 500);
  }
});

Deno.serve(app.fetch);