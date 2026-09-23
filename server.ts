import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import {
  getAllMadrasahOnlineData,
  getStaffList,
  getNewsList,
  getPPDBList,
  insertPPDB,
  updatePPDB,
  deletePPDB,
  upsertStaff,
  deleteStaff,
  upsertNews,
  deleteNews,
  setAppSetting,
  seedInitialDatabaseIfEmpty
} from './src/db/madrasah.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Real-time synchronization state & SSE clients
let currentDataVersion = Date.now();
const sseClients = new Set<express.Response>();

export function notifyDataChanged(changeType: string, payload?: any) {
  currentDataVersion = Date.now();
  const msg = JSON.stringify({
    type: 'data_changed',
    changeType,
    version: currentDataVersion,
    timestamp: new Date().toISOString(),
    payload
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${msg}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: "MI Ma'arif Al Ihsan Soborejo Online Database",
    database: 'Cloud SQL PostgreSQL',
    dataVersion: currentDataVersion,
    activeRealtimeClients: sseClients.size,
    timestamp: new Date().toISOString()
  });
});

// Data version lightweight check for clients
app.get('/api/data/version', (req, res) => {
  res.json({
    success: true,
    version: currentDataVersion,
    timestamp: new Date().toISOString()
  });
});

// Real-time Server-Sent Events (SSE) stream for live updates across all devices
app.get('/api/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Initial connection handshake
  res.write(`data: ${JSON.stringify({ type: 'connected', version: currentDataVersion, timestamp: new Date().toISOString() })}\n\n`);
  sseClients.add(res);

  // Heartbeat ping every 20 seconds to prevent connection timeout
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(pingInterval);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients.delete(res);
  });
});

// 1. Public Endpoint: Get all live data from Cloud SQL
app.get('/api/data', async (req, res) => {
  try {
    const data = await getAllMadrasahOnlineData();
    res.json({ success: true, data, version: currentDataVersion });
  } catch (error: any) {
    console.error('Error in /api/data:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal memuat data online' });
  }
});

// GET /api/staff - List of staff members from Cloud SQL
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await getStaffList();
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Gagal memuat data GTK' });
  }
});

// GET /api/news - List of published news from Cloud SQL
app.get('/api/news', async (req, res) => {
  try {
    const news = await getNewsList();
    res.json({ success: true, data: news });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Gagal memuat berita' });
  }
});

// GET /api/ppdb - List of PPDB registrations from Cloud SQL
app.get('/api/ppdb', requireAuth, async (req: AuthRequest, res) => {
  try {
    const list = await getPPDBList();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Gagal memuat data PPDB' });
  }
});

// 2. Public Endpoint: Student/Parent PPDB registration from any computer/phone
app.post('/api/ppdb/register', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.fullName || !payload.parentName || !payload.parentPhone) {
      return res.status(400).json({
        success: false,
        error: 'Nama lengkap calon santri, nama orang tua, dan nomor WhatsApp wajib diisi.'
      });
    }

    const regId = payload.id || `ppdb-${Date.now()}`;
    const regNumber = payload.registrationNumber || `PPDB-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    const saved = await insertPPDB({
      ...payload,
      id: regId,
      registrationNumber: regNumber,
      registrationDate: payload.registrationDate || new Date().toISOString().split('T')[0],
      status: payload.status || 'menunggu_verifikasi'
    });

    notifyDataChanged('ppdb', saved);

    res.json({
      success: true,
      message: 'Pendaftaran PPDB online berhasil disimpan ke Cloud SQL Database.',
      data: saved
    });
  } catch (error: any) {
    console.error('Error registering PPDB online:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan pendaftaran PPDB' });
  }
});

// 3. Authenticated: Sync Google/Firebase User to PostgreSQL
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const dbUser = await getOrCreateUser(user.uid, user.email || '', user.name);
    res.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyinkronkan user auth' });
  }
});

// 4. Authenticated: Update PPDB status / notes
app.post('/api/ppdb/update-status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id, status, notes } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'ID pendaftaran dan status baru wajib diisi' });
    }
    const updated = await updatePPDB(id, { status, notes });
    notifyDataChanged('ppdb', updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating PPDB status:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal memperbarui status PPDB' });
  }
});

// 5. Authenticated: Delete PPDB
app.delete('/api/ppdb/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await deletePPDB(id);
    notifyDataChanged('ppdb', { deletedId: id });
    res.json({ success: true, message: 'Data PPDB berhasil dihapus dari Cloud SQL' });
  } catch (error: any) {
    console.error('Error deleting PPDB:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menghapus data PPDB' });
  }
});

// 6. Authenticated: Upsert Staff (GTK)
app.post('/api/staff', requireAuth, async (req: AuthRequest, res) => {
  try {
    const item = req.body;
    if (!item.name || !item.role) {
      return res.status(400).json({ success: false, error: 'Nama dan jabatan guru/staf wajib diisi' });
    }
    const saved = await upsertStaff(item);
    notifyDataChanged('staff', saved);
    res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error('Error upserting staff:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan data GTK' });
  }
});

// 7. Authenticated: Delete Staff
app.delete('/api/staff/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await deleteStaff(id);
    notifyDataChanged('staff', { deletedId: id });
    res.json({ success: true, message: 'Data GTK berhasil dihapus dari Cloud SQL' });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menghapus data GTK' });
  }
});

// 8. Authenticated: Upsert News
app.post('/api/news', requireAuth, async (req: AuthRequest, res) => {
  try {
    const item = req.body;
    if (!item.title || !item.content) {
      return res.status(400).json({ success: false, error: 'Judul dan konten berita wajib diisi' });
    }
    const saved = await upsertNews(item);
    notifyDataChanged('news', saved);
    res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error('Error upserting news:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan berita' });
  }
});

// 9. Authenticated: Delete News
app.delete('/api/news/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await deleteNews(id);
    notifyDataChanged('news', { deletedId: id });
    res.json({ success: true, message: 'Berita berhasil dihapus dari Cloud SQL' });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menghapus berita' });
  }
});

// 10. Authenticated: Save App Setting
app.post('/api/settings/:key', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { key } = req.params;
    const value = req.body?.value !== undefined 
      ? req.body.value 
      : (req.body?.data !== undefined ? req.body.data : req.body?.[key]);
    const saved = await setAppSetting(key, value);
    notifyDataChanged(key, saved);
    res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error(`Error saving setting ${req.params.key}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan pengaturan' });
  }
});

// 11. Authenticated: Batch Save/Sync all settings
app.post('/api/sync-all', requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      schoolProfile,
      statsList,
      programs,
      extracurriculars,
      achievements,
      facilities,
      gallery,
      videoGallery,
      testimonials,
      faqs,
      staffList,
      studentList,
      newsList,
    } = req.body;

    const settingsToSave: { key: string; value: any }[] = [];

    if (schoolProfile !== undefined) settingsToSave.push({ key: 'school_profile', value: schoolProfile });
    if (statsList !== undefined) settingsToSave.push({ key: 'stats_list', value: statsList });
    if (programs !== undefined) settingsToSave.push({ key: 'programs', value: programs });
    if (extracurriculars !== undefined) settingsToSave.push({ key: 'extracurriculars', value: extracurriculars });
    if (achievements !== undefined) settingsToSave.push({ key: 'achievements', value: achievements });
    if (facilities !== undefined) settingsToSave.push({ key: 'facilities', value: facilities });
    if (gallery !== undefined) settingsToSave.push({ key: 'gallery', value: gallery });
    if (videoGallery !== undefined) settingsToSave.push({ key: 'video_gallery', value: videoGallery });
    if (testimonials !== undefined) settingsToSave.push({ key: 'testimonials', value: testimonials });
    if (faqs !== undefined) settingsToSave.push({ key: 'faqs', value: faqs });
    if (studentList !== undefined) settingsToSave.push({ key: 'student_list', value: Array.isArray(studentList) ? studentList : [] });
    if (staffList !== undefined) settingsToSave.push({ key: 'staff_list', value: Array.isArray(staffList) ? staffList : [] });

    for (const item of settingsToSave) {
      await setAppSetting(item.key, item.value);
    }

    if (staffList && Array.isArray(staffList)) {
      try {
        const incomingStaffIds = new Set(staffList.map((s: any) => s.id).filter(Boolean));
        const existingStaff = await getStaffList();
        for (const ex of existingStaff) {
          if (!incomingStaffIds.has(ex.id)) {
            await deleteStaff(ex.id).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Could not check existing staff for deletion:', err);
      }

      for (const s of staffList) {
        if (s.name && s.role) {
          try {
            await upsertStaff(s);
          } catch (err: any) {
            console.warn('Sync staff item note:', err?.message || err);
          }
        }
      }
    }

    if (newsList && Array.isArray(newsList)) {
      try {
        const incomingNewsIds = new Set(newsList.map((n: any) => n.id).filter(Boolean));
        const existingNews = await getNewsList();
        for (const ex of existingNews) {
          if (!incomingNewsIds.has(ex.id)) {
            await deleteNews(ex.id).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Could not check existing news for deletion:', err);
      }

      for (const n of newsList) {
        if (n.title) {
          try {
            await upsertNews(n);
          } catch (err: any) {
            console.warn('Sync news item note:', err?.message || err);
          }
        }
      }
    }

    notifyDataChanged('all');
    res.json({ success: true, message: 'Semua perubahan berhasil disinkronkan ke Cloud SQL Database.' });
  } catch (error: any) {
    console.error('Error syncing all settings:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menyinkronkan data ke Cloud SQL' });
  }
});

// Direct raw schema download for Supabase
app.get('/supabase_schema.sql', (req, res) => {
  const sqlPath = path.join(process.cwd(), 'public', 'supabase_schema.sql');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(sqlPath);
});

// Start Server and Vite Middleware
async function startServer() {
  // Vite middleware for development
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
    console.log(`Server online database running on http://0.0.0.0:${PORT}`);
    // Run initial baseline check asynchronously
    seedInitialDatabaseIfEmpty()
      .then(() => console.log('Database Cloud SQL verified & ready.'))
      .catch((err) => console.error('Initial DB seed check error:', err));
  });
}

// Process error listeners to prevent abrupt server crashes
process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection at server level:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception at server level:', err);
});

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
