const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Configuración de PostgreSQL con variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/pokemon-app')));

// **INICIALIZAR TABLAS**
app.post('/api/database/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        city VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'TRAINER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_pokemon (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        pokemon_data JSONB NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        pokemon_ids INTEGER[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ success: true, message: 'Tables initialized successfully' });
  } catch (error) {
    console.error('Error initializing tables:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// **USUARIOS**
app.post('/api/database/users', async (req, res) => {
  try {
    const { id, name, lastName, email, phone, city, role } = req.body;
    const result = await pool.query(
      'INSERT INTO users (id, name, last_name, email, phone, city, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, name, lastName, email, phone, city, role]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/database/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/database/users/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// **POKÉMON DEL USUARIO**
app.get('/api/database/pokemon/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT pokemon_data FROM user_pokemon WHERE user_id = $1', [userId]);
    const pokemon = result.rows.map(row => row.pokemon_data);
    res.json(pokemon);
  } catch (error) {
    console.error('Error getting user pokemon:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/database/pokemon/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { pokemon } = req.body;
    
    // Verificar si el Pokémon ya existe
    const existing = await pool.query(
      'SELECT id FROM user_pokemon WHERE user_id = $1 AND pokemon_data->>\'id\' = $2',
      [userId, pokemon.id.toString()]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_pokemon (user_id, pokemon_data) VALUES ($1, $2)',
        [userId, JSON.stringify(pokemon)]
      );
    }

    res.json({ success: true, message: 'Pokemon added successfully' });
  } catch (error) {
    console.error('Error adding pokemon:', error);
    res.status(500).json({ error: error.message });
  }
});

// **EQUIPOS**
app.get('/api/database/teams/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM teams WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting teams:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/database/teams', async (req, res) => {
  try {
    const { id, userId, name, description, pokemonIds } = req.body;
    const result = await pool.query(
      'INSERT INTO teams (id, user_id, name, description, pokemon_ids) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, userId, name, description, pokemonIds]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: error.message });
  }
});

// **MIGRACIÓN DESDE LOCALSTORAGE**
app.post('/api/database/migrate', async (req, res) => {
  try {
    const { users, userData } = req.body;
    let migratedUsers = 0;
    let migratedPokemon = 0;
    let migratedTeams = 0;

    // Migrar usuarios
    for (const user of users) {
      try {
        await pool.query(
          'INSERT INTO users (id, name, last_name, email, phone, city, role) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO NOTHING',
          [user.id, user.name, user.lastName, user.email, user.phone, user.city, user.role]
        );
        migratedUsers++;
      } catch (userError) {
        console.error('Error migrating user:', user.email, userError);
      }
    }

    // Migrar datos de usuario
    for (const data of userData) {
      try {
        // Migrar Pokémon
        for (const pokemon of data.pokedex) {
          await pool.query(
            'INSERT INTO user_pokemon (user_id, pokemon_data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [data.user.id, JSON.stringify(pokemon)]
          );
          migratedPokemon++;
        }

        // Migrar equipos
        for (const team of data.teams) {
          await pool.query(
            'INSERT INTO teams (id, user_id, name, description, pokemon_ids) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
            [team.id, data.user.id, team.name, team.description, team.pokemonIds]
          );
          migratedTeams++;
        }
      } catch (dataError) {
        console.error('Error migrating user data:', dataError);
      }
    }

    res.json({
      success: true,
      message: 'Migration completed',
      stats: { migratedUsers, migratedPokemon, migratedTeams }
    });
  } catch (error) {
    console.error('Error during migration:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servir la aplicación Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/pokemon-app/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Database: ${process.env.PGDATABASE}`);
});