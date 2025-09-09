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