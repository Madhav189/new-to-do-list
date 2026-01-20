import { useState, useEffect } from 'react';

export default function Home() {
  // --- STATE ---
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ task: '', deadline: '' });
  const [editingId, setEditingId] = useState(null);
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
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId, is_completed: false }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    setForm({ task: '', deadline: '' });
    fetchTodos();
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

  const handleLogout = () => {
    // Simple logout by forcing reload (cookies will persist, but for this demo it resets state)
    // For real logout, you'd need an API route to clear cookies.
    window.location.reload();
  };

  // --- UI COMPONENTS ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-blue-400 font-bold animate-pulse">Loading Your Tasks...</div>;

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 px-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
           <div className="text-center mb-8">
             <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
               {isSignUpMode ? 'Join Us' : 'Welcome Back'}
             </h2>
             <p className="text-gray-300 text-sm">Manage your life efficiently.</p>
           </div>

           <div className="space-y-4">
             <input className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    placeholder="Username" value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})} />
             <input type="password" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})} />
             
             <button onClick={handleAuth} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-[1.02]">
               {isSignUpMode ? 'Create Account' : 'Access Dashboard'}
             </button>
             
             <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full text-gray-400 text-sm hover:text-white transition">
               {isSignUpMode ? 'Already have an account? Sign In' : "New here? Create an account"}
             </button>
           </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 font-sans text-slate-100">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Task Master
            </h1>
            <p className="text-slate-400 mt-1">Focus on what matters most.</p>
          </div>
          <div className="text-right">
             <span className="inline-block px-4 py-1 bg-slate-800 rounded-full text-sm font-mono border border-slate-700 text-blue-300">
               {todos.length} Active Tasks
             </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-2xl shadow-xl mb-8 border border-slate-700 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <input 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition text-white placeholder-slate-500"
              value={form.task} 
              onChange={e => setForm({...form, task: e.target.value})} 
              placeholder="What is your next goal?" 
            />
            <div className="flex gap-3">
              <input 
                type="date"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-300"
                value={form.deadline} 
                onChange={e => setForm({...form, deadline: e.target.value})} 
              />
              <button type="submit" className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {editingId ? 'Update Task' : 'Add Task'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ task: '', deadline: '' }); }} className="px-4 py-2 bg-slate-700 rounded-xl text-slate-300 hover:bg-slate-600">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
             <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
               <p className="text-slate-500 text-lg">Your list is empty. Time to relax or start building!</p>
             </div>
          ) : (
            todos.map(t => (
              <div key={t.id} className="group bg-slate-800 p-5 rounded-2xl shadow-md border border-slate-700 flex items-center justify-between hover:border-purple-500/50 hover:shadow-purple-500/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 h-3 w-3 rounded-full shadow-[0_0_10px] ${t.deadline ? 'bg-orange-400 shadow-orange-400/50' : 'bg-blue-400 shadow-blue-400/50'}`}></div>
                  <div>
                    <div className="font-semibold text-lg text-slate-100">{t.task}</div>
                    {t.deadline && (
                      <div className="flex items-center gap-1 text-xs text-orange-400 font-medium mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Due: {t.deadline}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <button onClick={() => handleEdit(t)} className="p-2 bg-slate-700 hover:bg-blue-600 text-white rounded-lg transition" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 bg-slate-700 hover:bg-red-500 text-white rounded-lg transition" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}