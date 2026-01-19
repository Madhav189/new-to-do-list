// pages/api/todos.js
import { db } from '../../lib/db';

export default async function handler(req, res) {
  const userId = req.cookies.auth; 

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  // GET: Fetch all tasks
  if (req.method === 'GET') {
    const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY deadline ASC', [userId]);
    res.json(todos);
  } 
  
  // POST: Create new task
  else if (req.method === 'POST') {
    const { task, deadline } = req.body;
    await db.query('INSERT INTO todos (user_id, task, deadline) VALUES (?, ?, ?)', [userId, task, deadline]);
    res.json({ success: true });
  }

  // PUT: Update/Edit existing task
  else if (req.method === 'PUT') {
    const { id, task, is_completed, deadline } = req.body;
    
    // Safety check: ensure we only update tasks that belong to this user
    await db.query(
      'UPDATE todos SET task = ?, is_completed = ?, deadline = ? WHERE id = ? AND user_id = ?', 
      [task, is_completed, deadline, id, userId]
    );
    res.json({ success: true });
  }

  // DELETE: Remove task
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true });
  }
}