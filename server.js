const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para ler JSON
app.use(express.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '/public')));

// Conexão com PostgreSQL (Railway fornece DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Criar tabela se não existir
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS confirmations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      presence VARCHAR(50) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("Tabela 'confirmations' pronta.");
})();

// Endpoint para receber confirmações
app.post('/api/rsvp', async (req, res) => {
  const { name, presence } = req.body;
  if (!name || !presence) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  try {
    const result = await pool.query(
      "INSERT INTO confirmations (name, presence) VALUES ($1, $2) RETURNING *",
      [name, presence]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Erro ao salvar confirmação:', err);
    res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
});

// Endpoint para listar confirmações
app.get('/api/rsvp', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM confirmations ORDER BY timestamp DESC");
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar confirmações:', err);
    res.status(500).json({ error: 'Erro ao buscar no banco' });
  }
});

// Endpoint para excluir confirmação por ID
app.delete('/api/rsvp/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM confirmations WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir confirmação:', err);
    res.status(500).json({ error: 'Erro ao excluir no banco' });
  }
});

// Qualquer outra rota retorna o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
