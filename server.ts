import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '50mb' }));

// Ensure persistent data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LATEST_STORE_FILE = path.join(DATA_DIR, 'store_latest.json');

function sanitizeFilename(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
}

// ----------------------------------------------------
// API ROUTES FOR AUTOMATIC CLOUD SYNC & RESTORE
// ----------------------------------------------------

// 1. Get Latest Store Backup (Auto-loaded whenever any browser opens the site)
app.get('/api/store/latest', (req, res) => {
  try {
    if (fs.existsSync(LATEST_STORE_FILE)) {
      const content = fs.readFileSync(LATEST_STORE_FILE, 'utf-8');
      const data = JSON.parse(content);
      return res.json({ success: true, source: 'latest', data });
    }
    return res.json({ success: false, message: 'No cloud backup exists yet. Using default initial dataset.' });
  } catch (error: any) {
    console.error('Error fetching latest store backup:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error reading backup' });
  }
});

// 2. Restore Store Backup by Admin Email
app.get('/api/store/restore', (req, res) => {
  try {
    const email = req.query.email as string;
    if (email) {
      const sanitized = sanitizeFilename(email);
      const emailFile = path.join(DATA_DIR, `store_backup_${sanitized}.json`);
      if (fs.existsSync(emailFile)) {
        const content = fs.readFileSync(emailFile, 'utf-8');
        const data = JSON.parse(content);
        return res.json({ success: true, source: 'email_file', email, data });
      }
    }

    // Fallback to latest store backup if email file not found
    if (fs.existsSync(LATEST_STORE_FILE)) {
      const content = fs.readFileSync(LATEST_STORE_FILE, 'utf-8');
      const data = JSON.parse(content);
      return res.json({ success: true, source: 'latest_fallback', email, data });
    }

    return res.json({ success: false, message: `No data found for email: ${email}` });
  } catch (error: any) {
    console.error('Error restoring store backup:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// 3. Save / Auto-Save Store Data to Cloud (Associated with Admin Email)
app.post('/api/store/backup', (req, res) => {
  try {
    const { adminEmail, products, categories, banners, settings, orders, promos, user } = req.body;

    const timestamp = new Date().toISOString();
    const storePayload = {
      timestamp,
      adminEmail: adminEmail || settings?.adminEmail || 'admin@litchibagan.com',
      products: products || [],
      categories: categories || [],
      banners: banners || [],
      settings: settings || {},
      orders: orders || [],
      promos: promos || [],
      user: user || null,
    };

    const jsonStr = JSON.stringify(storePayload, null, 2);

    // Save to global latest store file
    fs.writeFileSync(LATEST_STORE_FILE, jsonStr, 'utf-8');

    // Save to admin-email-specific backup file
    if (storePayload.adminEmail) {
      const sanitized = sanitizeFilename(storePayload.adminEmail);
      const emailFile = path.join(DATA_DIR, `store_backup_${sanitized}.json`);
      fs.writeFileSync(emailFile, jsonStr, 'utf-8');
    }

    return res.json({
      success: true,
      timestamp,
      adminEmail: storePayload.adminEmail,
      totalProducts: storePayload.products.length,
      totalOrders: storePayload.orders.length,
      message: 'ক্লাউড সার্ভারে ডাটা সফলভাবে অটো-সেভ ও সিন্ক হয়েছে',
    });
  } catch (error: any) {
    console.error('Error saving store backup:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to auto-save backup' });
  }
});

// 4. Server Sync Status
app.get('/api/store/status', (req, res) => {
  try {
    if (fs.existsSync(LATEST_STORE_FILE)) {
      const stats = fs.statSync(LATEST_STORE_FILE);
      const content = fs.readFileSync(LATEST_STORE_FILE, 'utf-8');
      const data = JSON.parse(content);
      return res.json({
        synced: true,
        lastSavedAt: data.timestamp || stats.mtime.toISOString(),
        adminEmail: data.adminEmail || 'admin@litchibagan.com',
        totalProducts: data.products ? data.products.length : 0,
        totalOrders: data.orders ? data.orders.length : 0,
        fileSizeBytes: stats.size,
      });
    }
    return res.json({ synced: false, message: 'No server backup file generated yet' });
  } catch (error: any) {
    return res.status(500).json({ synced: false, error: error.message });
  }
});

// ----------------------------------------------------
// VITE / STATIC SERVING MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
