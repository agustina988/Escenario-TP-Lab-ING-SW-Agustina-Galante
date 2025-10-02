const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',
  database: 'test_db',      
  password: 'tu_password', 
  port: 5432,
});


const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const res = await pool.query('SELECT COUNT(*) FROM products');
    if (res.rows[0].count > 0) {
      console.log('La base de datos ya está inicializada.');
      return;
    }

    
    const sampleProducts = [
      ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'],
      ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'],
      ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair'],
      ['Coffee Beans', 'Food', 120, 12.99, 'Premium coffee beans'],
      ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 notebooks']
    ];

    
    const queryText = 'INSERT INTO products (name, category, quantity, price, description) VALUES ($1, $2, $3, $4, $5)';
    for (const product of sampleProducts) {
      await pool.query(queryText, product);
    }
    console.log('Base de datos inicializada y datos de ejemplo insertados.');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err.stack);
  }
};


initializeDatabase();

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const queryText = 'INSERT INTO products (name, category, quantity, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const { rows } = await pool.query(queryText, [name, category, quantity, price, description]);
    res.json({ id: rows[0].id, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description } = req.body;
  try {
    const queryText = 'UPDATE products SET name = $1, category = $2, quantity = $3, price = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6';
    const { rowCount } = await pool.query(queryText, [name, category, quantity, price, description, id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(quantity) as total_items,
        COUNT(DISTINCT category) as categories,
        SUM(quantity * price) as total_value
      FROM products
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
