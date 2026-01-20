import { db } from '../../lib/db';

export default async function handler(req, res) {
  const userId = req.cookies.auth; 
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    // Sort by: Not Completed first, then by Priority (High > Medium > Low), then by Deadline
    const [todos] = await db.query(`
      SELECT * FROM todos 
      WHERE user_id = ? 
      ORDER BY is_completed ASC, 
      CASE priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
        ELSE 4
      END ASC,
      deadline ASC
    `, [userId]);
    res.json(todos);
  } 
  
  else if (req.method === 'POST') {
    const { task, deadline, priority } = req.body;
    await db.query('INSERT INTO todos (user_id, task, deadline, priority) VALUES (?, ?, ?, ?)', 
      [userId, task, deadline, priority || 'medium']);
    res.json({ success: true });
  }

  else if (req.method === 'PUT') {
    const { id, task, is_completed, deadline, priority } = req.body;
    await db.query(
      'UPDATE todos SET task = ?, is_completed = ?, deadline = ?, priority = ? WHERE id = ? AND user_id = ?', 
      [task, is_completed, deadline, priority, id, userId]
    );
    res.json({ success: true });
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true });
  }
}