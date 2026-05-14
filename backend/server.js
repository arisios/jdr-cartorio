const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3005;

app.set('trust proxy', 1);

const allowedOrigins = [
  'https://cartoriojunino.festasjuninasdorio.com',
  'http://localhost:5177',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error('CORS não permitido')),
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({ windowMs: 15*60*1000, max: 300, message: { error: 'Muitas requisições.' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20, message: { error: 'Muitas tentativas.' } });
const adminLimiter = rateLimit({ windowMs: 15*60*1000, max: 500, message: { error: 'Muitas requisições.' } });

app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/admin', adminLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/certidoes', require('./routes/certidoes'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Cartório Junino da Vila', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

initDb();
app.listen(PORT, () => console.log(`💍 Cartório Junino rodando na porta ${PORT}`));
