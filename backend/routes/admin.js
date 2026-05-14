const express = require('express');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../database/db');
const { adminMiddleware } = require('../middleware/auth');
const router = express.Router();
const UPLOADS_DIR = path.join(__dirname, '../uploads');

router.get('/certidoes', adminMiddleware, (req, res) => {
  const { tipo } = req.query;
  let q = 'SELECT * FROM certidoes WHERE 1=1';
  const params = [];
  if (tipo) { q += ' AND tipo=?'; params.push(tipo); }
  q += ' ORDER BY created_at DESC';
  res.json({ certidoes: getDb().prepare(q).all(...params) });
});

router.delete('/certidoes/:id', adminMiddleware, (req, res) => {
  const db = getDb();
  const c = db.prepare('SELECT * FROM certidoes WHERE id=?').get(parseInt(req.params.id));
  if (!c) return res.status(404).json({ error: 'Não encontrado' });
  [c.foto1_path, c.foto2_path].filter(Boolean).forEach(f => {
    const p = path.join(UPLOADS_DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
  db.prepare('DELETE FROM certidoes WHERE id=?').run(c.id);
  res.json({ success: true });
});

router.get('/textos', adminMiddleware, (req, res) => {
  res.json({ textos: getDb().prepare('SELECT * FROM textos ORDER BY tipo, variacao').all() });
});

router.post('/textos', adminMiddleware, (req, res) => {
  const { tipo, variacao, texto } = req.body;
  if (!tipo || !variacao || !texto) return res.status(400).json({ error: 'Campos obrigatórios' });
  const result = getDb().prepare('INSERT INTO textos (tipo, variacao, texto) VALUES (?,?,?)').run(tipo, parseInt(variacao), texto);
  res.status(201).json({ texto: getDb().prepare('SELECT * FROM textos WHERE id=?').get(result.lastInsertRowid) });
});

router.patch('/textos/:id', adminMiddleware, (req, res) => {
  const db = getDb();
  const t = db.prepare('SELECT * FROM textos WHERE id=?').get(parseInt(req.params.id));
  if (!t) return res.status(404).json({ error: 'Texto não encontrado' });
  const { texto, ativo } = req.body;
  db.prepare('UPDATE textos SET texto=?, ativo=? WHERE id=?').run(texto ?? t.texto, ativo !== undefined ? (ativo ? 1 : 0) : t.ativo, t.id);
  res.json({ texto: db.prepare('SELECT * FROM textos WHERE id=?').get(t.id) });
});

router.get('/stats', adminMiddleware, (req, res) => {
  const db = getDb();
  res.json({ stats: {
    total: db.prepare('SELECT COUNT(*) as c FROM certidoes').get().c,
    porTipo: db.prepare('SELECT tipo, COUNT(*) as count FROM certidoes GROUP BY tipo ORDER BY count DESC').all(),
    textos: db.prepare('SELECT COUNT(*) as c FROM textos WHERE ativo=1').get().c,
  }});
});

module.exports = router;
