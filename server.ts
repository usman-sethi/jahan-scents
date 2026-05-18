import express from "express";
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = "your-super-secret-jwt-key";

const uri = "mongodb://admin:16Paradox2006@ac-chlkpz1-shard-00-00.a54grbt.mongodb.net:27017,ac-chlkpz1-shard-00-01.a54grbt.mongodb.net:27017,ac-chlkpz1-shard-00-02.a54grbt.mongodb.net:27017/perfume?ssl=true&replicaSet=atlas-o5kywo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize MongoDB Connection Lazily
client.connect().then(() => {
  client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ========== AUTHENTICATION ROUTES ==========
  app.post("/api/auth/register", async (req, res) => {
    console.log("Register endpoint hit:", req.body);
    try {
      const { email, password, name, phone } = req.body;
      const db = client.db("perfume");
      const users = db.collection("users");

      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await users.insertOne({ 
        email, 
        password: hashedPassword,
        name,
        phone,
        // Make the first user an admin, or set specific emails to admin
        role: email === 'admin@jahan.com' || email === 'paradox@test.com' ? 'admin' : 'user'
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    console.log("Login endpoint hit:", req.body);
    try {
      const { email, password } = req.body;
      const db = client.db("perfume");
      const users = db.collection("users");

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ 
        token, 
        user: { id: user._id, email: user.email, role: user.role } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const users = db.collection("users");
      const user = await users.findOne({ _id: new ObjectId(req.user.id) });
      
      if (!user) return res.status(404).json({ error: "User not found" });
      
      res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, role: user.role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/auth/profile", authenticateToken, async (req: any, res) => {
    try {
      const { name, phone, password } = req.body;
      const db = client.db("perfume");
      const users = db.collection("users");
      
      const updateData: any = { name, phone };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await users.updateOne(
        { _id: new ObjectId(req.user.id) },
        { $set: updateData }
      );
      
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // ========== ADMIN ROUTES ==========
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: "Require admin role" });
    next();
  };

  app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const orders = db.collection("orders");
      const allOrders = await orders.find().sort({ createdAt: -1 }).toArray();
      res.json(allOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status, trackingNumber } = req.body;
      const db = client.db("perfume");
      const orders = db.collection("orders");
      
      const updateData: any = {};
      if (status) updateData.status = status;
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

      await orders.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
      );
      res.json({ message: "Order updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const users = db.collection("users");
      const allUsers = await users.find({}, { projection: { password: 0 } }).sort({ createdAt: -1 }).toArray();
      res.json(allUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { role } = req.body;
      const db = client.db("perfume");
      const users = db.collection("users");
      await users.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { role } }
      );
      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const users = db.collection("users");
      await users.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  
  app.get("/api/admin/reviews", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const reviews = db.collection("reviews");
      const allReviews = await reviews.find({}).sort({ createdAt: -1 }).toArray();
      res.json(allReviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.put("/api/admin/reviews/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status } = req.body;
      const db = client.db("perfume");
      const reviews = db.collection("reviews");
      await reviews.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status } }
      );
      res.json({ message: "Review status updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  app.delete("/api/admin/reviews/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const reviews = db.collection("reviews");
      await reviews.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // ========== CMS ROUTES ==========
  app.get("/api/cms", async (req, res) => {
    try {
      const db = client.db("perfume");
      const cms = db.collection("cms");
      const settings = await cms.findOne({ type: "homepage" });
      res.json(settings || {});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch CMS settings" });
    }
  });

  app.put("/api/admin/cms", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const cms = db.collection("cms");
      await cms.updateOne(
        { type: "homepage" },
        { $set: { ...req.body, type: "homepage", updatedAt: new Date() } },
        { upsert: true }
      );
      res.json({ message: "CMS settings updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update CMS settings" });
    }
  });

  // ========== SLIDERS ROUTES ==========
  app.get("/api/sliders", async (req, res) => {
    try {
      const db = client.db("perfume");
      const sliders = db.collection("sliders");
      const items = await sliders.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch sliders" });
    }
  });

  app.post("/api/admin/sliders", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const sliders = db.collection("sliders");
      const slider = { ...req.body, createdAt: new Date() };
      await sliders.insertOne(slider);
      res.status(201).json({ message: "Slider created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create slider" });
    }
  });

  app.put("/api/admin/sliders/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const sliders = db.collection("sliders");
      const { _id, ...updateData } = req.body;
      await sliders.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      res.json({ message: "Slider updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update slider" });
    }
  });

  app.delete("/api/admin/sliders/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const sliders = db.collection("sliders");
      await sliders.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Slider deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete slider" });
    }
  });

  // ========== ORDERS ROUTES ==========
  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const { items, subtotal, shippingCost, total, shippingInfo } = req.body;
      const db = client.db("perfume");
      const orders = db.collection("orders");
      
      const newOrder = {
        userId: new ObjectId(req.user.id),
        items,
        subtotal,
        shippingCost,
        total,
        shippingInfo,
        status: "processing",
        createdAt: new Date()
      };
      
      await orders.insertOne(newOrder);

      // Send order details to Google Sheets if configured
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxGdbjTPfPlBfJRLZtnGdoROPEkQ-1i6C_dT0eTSlxOYAFafzSWfy_mRgfUjDcFlI5G/exec";
      if (googleScriptUrl) {
        try {
          const userEmail = req.user.email || shippingInfo?.email || 'Customer';
          const itemsList = items.map((item: any) => `${item.name} x${item.quantity}`).join(', ');

          const payload = {
            type: 'order',
            orderId: newOrder._id?.toString() || 'New',
            date: newOrder.createdAt.toISOString(),
            customerEmail: userEmail,
            total: total,
            items: itemsList,
            shippingAddress: `${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.zip}, ${shippingInfo?.country}`,
            status: newOrder.status
          };

          const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            console.error("Failed to send order to Google Sheets, status:", response.status);
          }
        } catch (webhookErr) {
          console.error("Failed to send order to Google Sheets:", webhookErr);
          // Don't fail the order creation if the webhook fails
        }
      }

      res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const orders = db.collection("orders");
      const userOrders = await orders.find({ userId: new ObjectId(req.user.id) }).sort({ createdAt: -1 }).toArray();
      res.json(userOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // ========== WISHLIST ROUTES ==========
  app.get("/api/wishlist", authenticateToken, async (req: any, res) => {
    try {
      const db = client.db("perfume");
      const wishlist = db.collection("wishlist");
      const userWishlist = await wishlist.find({ userId: new ObjectId(req.user.id) }).toArray();
      res.json(userWishlist);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", authenticateToken, async (req: any, res) => {
    try {
      const { productId, name, price, image } = req.body;
      const db = client.db("perfume");
      const wishlist = db.collection("wishlist");
      
      const existing = await wishlist.findOne({ userId: new ObjectId(req.user.id), productId });
      if (existing) {
        await wishlist.deleteOne({ _id: existing._id });
        res.json({ message: "Removed from wishlist", state: false });
      } else {
        await wishlist.insertOne({ userId: new ObjectId(req.user.id), productId, name, price, image, createdAt: new Date() });
        res.status(201).json({ message: "Added to wishlist", state: true });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to toggle wishlist" });
    }
  });

  // ========== PRODUCT ROUTES ==========
  app.get("/api/products", async (req, res) => {
    try {
      const db = client.db("perfume");
      const collection = db.collection("perfume");
      const products = await collection.find({}).toArray();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const db = client.db("perfume");
      const collection = db.collection("perfume");
      let objectId;
      try {
        objectId = new ObjectId(req.params.id);
      } catch (e) {
        return res.status(404).json({ error: "Invalid product ID syntax" });
      }
      const product = await collection.findOne({ _id: objectId });
      if (!product) return res.status(404).json({ error: "Not found" });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // ========== REVIEWS ROUTES ==========
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const db = client.db("perfume");
      const reviews = db.collection("reviews");
      const productReviews = await reviews.find({ productId: req.params.id }).toArray();
      res.json(productReviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", authenticateToken, async (req: any, res) => {
    try {
      const { rating, comment, name, images, verdict, longevity, gender, ageGroup } = req.body;
      const db = client.db("perfume");
      const reviews = db.collection("reviews");
      
      const newReview = {
        productId: req.params.id,
        userId: new ObjectId(req.user.id),
        name: name || req.user.email.split('@')[0],
        rating: Number(rating),
        comment,
        images: Array.isArray(images) ? images : [],
        verdict,
        longevity,
        gender,
        ageGroup,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        createdAt: new Date()
      };
      
      await reviews.insertOne(newReview);
      res.status(201).json({ message: "Review posted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to post review" });
    }
  });

  app.post("/api/products", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Require admin role" });
    }
    try {
      const db = client.db("perfume");
      const collection = db.collection("perfume");
      const result = await collection.insertOne(req.body);
      res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save product" });
    }
  });

  app.put("/api/products/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Require admin role" });
    }
    try {
      const db = client.db("perfume");
      const collection = db.collection("perfume");
      // Don't update _id field
      const { _id, ...updateData } = req.body;
      await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
      );
      res.json({ message: "Product updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Require admin role" });
    }
    try {
      const db = client.db("perfume");
      const collection = db.collection("perfume");
      await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ========== SUBSCRIBE ROUTES ==========
  app.get("/api/subscribers", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }
      const db = client.db("perfume");
      const subscribers = db.collection("subscribers");
      const list = await subscribers.find({}).sort({ createdAt: -1 }).toArray();
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, phone } = req.body;
      
      // If deployed with Google Script URL set, send data to Google Sheets
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxGdbjTPfPlBfJRLZtnGdoROPEkQ-1i6C_dT0eTSlxOYAFafzSWfy_mRgfUjDcFlI5G/exec";
      
      if (googleScriptUrl) {
        const response = await fetch(googleScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'newsletter', email, phone, timestamp: new Date().toISOString() })
        });
        
        if (!response.ok) {
           throw new Error('Google Sheets integration is configured but access was denied. Ensure your Google Apps Script is deployed as a Web App with access set to "Anyone".');
        }
      }
      
      // Optionally store it in MongoDB as well
      const db = client.db("perfume");
      const subscribers = db.collection("subscribers");
      await subscribers.insertOne({
        email,
        phone,
        createdAt: new Date()
      });
      
      res.json({ message: "Successfully subscribed" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to process subscription", details: err.message, stack: err.stack });
    }
  });

  // Catch-all for API routes to prevent Vite from returning HTML for 404s
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  (async () => {
    try {
      const viteModule = await import("vite");
      const createViteServer = viteModule.createServer;
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Vite failed to load:", e);
    }
  })();
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler to guarantee JSON responses
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  if (!res.headersSent) {
    if (req.originalUrl.startsWith('/api/')) {
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    } else {
      next(err);
    }
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
