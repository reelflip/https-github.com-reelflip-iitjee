const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Auth Routes ---
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // In production, compare password hashes (e.g., bcrypt.compare)
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
    
    if (rows.length > 0) {
      // Simple password check for demo (replace with hash check)
      // if (rows[0].password_hash !== password) return res.status(401).json({ error: 'Invalid credentials' });
      
      const user = rows[0];
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        linkedStudentId: user.linked_student_id 
      });
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, role, password } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  try {
    await db.query('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', 
      [id, name, email, password || 'default123', role]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Data Routes ---

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapters', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chapters');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chapters', async (req, res) => {
  const { id, subject, name, totalTopics } = req.body;
  try {
    await db.query('INSERT INTO chapters (id, subject, name, total_topics) VALUES (?, ?, ?, ?)', 
      [id, subject, name, totalTopics]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/update', async (req, res) => {
  const { userId, chapterId, status } = req.body;
  try {
    await db.query(`
      INSERT INTO progress (user_id, chapter_id, status) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE status = ?`, 
      [userId, chapterId, status, status]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});