const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb, randomCarimbo, randomTexto } = require('../database/db');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const TIPOS_VALIDOS = ['amor','comida','quentao','forro','bagunca','quadrilha','arrastape'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get('/tipos', (req, res) => {
  res.json({ tipos: [
    {id:'amor',      emoji:'❤️', label:'União por Amor'},
    {id:'comida',    emoji:'🌽', label:'Sociedade da Comida Típica'},
    {id:'quentao',   emoji:'🍻', label:'Sociedade do Quentão'},
    {id:'forro',     emoji:'🪗', label:'Par Oficial do Forró'},
    {id:'bagunca',   emoji:'😂', label:'Parceiros da Bagunça'},
    {id:'quadrilha', emoji:'👒', label:'Compadres da Quadrilha'},
    {id:'arrastape', emoji:'🎶', label:'Dupla do Arrasta-pé'},
  ]});
});

router.post('/', upload.fields([{ name: 'foto1', maxCount: 1 }, { name: 'foto2', maxCount: 1 }]), (req, res) => {
  const { tipo, nome1, nome2, assinatura, assinatura2, event_name } = req.body;

  if (!tipo || !TIPOS_VALIDOS.includes(tipo)) return res.status(400).json({ error: 'Tipo de união inválido' });
  if (!nome1?.trim() || !nome2?.trim()) return res.status(400).json({ error: 'Informe os dois nomes' });

  const texto = randomTexto(tipo);
  if (!texto) return res.status(500).json({ error: 'Textos não encontrados para este tipo' });

  const carimbo = randomCarimbo();
  const cert_token = Date.now().toString(36) + Math.random().toString(36).slice(2);

  const foto1_path = req.files?.foto1?.[0]?.filename || null;
  const foto2_path = req.files?.foto2?.[0]?.filename || null;

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO certidoes (tipo, nome1, nome2, foto1_path, foto2_path, texto_id, texto_usado, assinatura, assinatura2, carimbo, cert_token, event_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tipo, nome1.trim(), nome2.trim(), foto1_path, foto2_path, texto.id, texto.texto, assinatura || null, assinatura2 || null, carimbo, cert_token, event_name || 'Juninas 2026');

  const certidao = db.prepare('SELECT * FROM certidoes WHERE id=?').get(result.lastInsertRowid);
  res.status(201).json({ certidao, cert_token, share_url: `/c/${cert_token}` });
});

router.get('/token/:token', (req, res) => {
  const certidao = getDb().prepare('SELECT * FROM certidoes WHERE cert_token=?').get(req.params.token);
  if (!certidao) return res.status(404).json({ error: 'Certidão não encontrada' });
  res.json({ certidao });
});

module.exports = router;
