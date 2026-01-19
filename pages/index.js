import { useState, useEffect } from 'react';

export default function Home() {
  // --- STATE ---
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ task: '', deadline: '' });
  const [editingId, setEditingId] = useState(null); // Tracks which ID we are editing
  
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // --- INITIAL LOAD ---
  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = () => {
    fetch('/api/todos').then(res => {
      if (res.ok) {
        setIsLoggedIn(true);
        res.json().then(data => {
            // Format date for display
            const formatted = data.map(t => ({
                ...t, 
                deadline: t.deadline ? t.deadline.split('T')[0] : ''
            }));
            setTodos(formatted);
        });
      }
      setLoading(false);
    });
  };

  // --- ACTIONS ---
  const handleAuth = async () => {
    const endpoint = isSignUpMode ? '/api/auth/signup' : '/api/auth/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auth),
    });
    if (res.ok) {
      if (isSignUpMode) {
        alert('Account created! Please log in.');
        setIsSignUpMode(false);
      } else {
        window.location.reload();
      }
    } else {
      alert('Authentication failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.task) return;

    if (editingId) {
      // UPDATE EXISTING
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId, is_completed: false }),
      });
      setEditingId(null);
    } else {
      // CREATE NEW
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    setForm({ task: '', deadline: '' }); // Clear form
    fetchTodos(); // Refresh list
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setForm({ task: todo.task, deadline: todo.deadline || '' });
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this task?")) return;
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  // --- UI RENDER ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
           <h2 className="text-3xl font-bold text-center mb-6">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
           <input className="w-full mb-3 px-4 py-3 border rounded-lg" placeholder="Username" value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})} />
           <input type="password" className="w-full mb-6 px-4 py-3 border rounded-lg" placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})} />
           <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">{isSignUpMode ? 'Sign Up' : 'Sign In'}</button>
           <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-4 text-blue-600 text-sm">{isSignUpMode ? 'Switch to Login' : 'Switch to Sign Up'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h1>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <input 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.task} 
              onChange={e => setForm({...form, task: e.target.value})} 
              placeholder="What needs to be done?" 
            />
            <div className="flex gap-3">
              <input 
                type="date"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                value={form.deadline} 
                onChange={e => setForm({...form, deadline: e.target.value})} 
              />
              <button type="submit" className={`px-8 py-2 rounded-lg font-bold text-white transition ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ task: '', deadline: '' }); }} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* TASK LIST */}
        <div className="space-y-3">
          {todos.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
              <div>
                <div className="font-medium text-lg text-gray-800">{t.task}</div>
                {t.deadline && (
                  <div className="text-xs text-red-500 font-semibold mt-1">
                    📅 Due: {t.deadline}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-md">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm rounded-md">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}