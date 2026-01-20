import { useState, useEffect } from 'react';

const QUOTES = [
  "Consistency is the key to success.",
  "Small steps every day add up to big results.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your future is created by what you do today, not tomorrow.",
  "Dream big and dare to fail.",
  "Action is the foundational key to all success."
];

export default function Home() {
  // --- STATE ---
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ task: '', deadline: '' });
  const [editingId, setEditingId] = useState(null);
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  
  // THEME & QUOTES
  const [darkMode, setDarkMode] = useState(true);
  const [quote, setQuote] = useState('');

  // --- INITIAL LOAD ---
  useEffect(() => { 
    fetchTodos(); 
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

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
      // Delay to show the heart animation
      setTimeout(() => setLoading(false), 2500); 
    });
  };

  const completedCount = todos.filter(t => t.is_completed).length;
  const activeCount = todos.length - completedCount;

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
      const currentTodo = todos.find(t => t.id === editingId);
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId, is_completed: currentTodo.is_completed }),
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

  const toggleComplete = async (todo) => {
    const newStatus = !todo.is_completed;
    const updatedTodos = todos.map(t => t.id === todo.id ? { ...t, is_completed: newStatus } : t);
    setTodos(updatedTodos);

    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: todo.id, 
        task: todo.task, 
        deadline: todo.deadline, 
        is_completed: newStatus 
      }),
    });
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

  // --- NEW HEART LOADING ANIMATION ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden">
      
      {/* The PulsePlan Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 tracking-tighter">
          PulsePlan
        </h1>
      </div>

      {/* The Beating Heart */}
      <div className="text-8xl animate-heartbeat drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
        ❤️
      </div>
      
      {/* Loading Text */}
      <h2 className="mt-8 text-xl font-medium text-slate-400 animate-pulse tracking-widest uppercase text-sm">
        System Initializing...
      </h2>

      {/* CSS For Heartbeat */}
      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 px-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative overflow-hidden">
           {/* Decorative Pulse Element */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

           <div className="text-center mb-8">
             <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
               PulsePlan<span className="text-cyan-400">.</span>
             </h1>
             <p className="text-indigo-200 text-sm">Organize your life rhythm.</p>
           </div>
           
           <div className="space-y-4">
             <input className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 transition placeholder-slate-400" 
                    placeholder="Username" value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})} />
             <input type="password" className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 transition placeholder-slate-400" 
                    placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})} />
             
             <button onClick={handleAuth} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition transform hover:scale-[1.02]">
               {isSignUpMode ? 'Get Started' : 'Sign In'}
             </button>
             
             <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full text-slate-400 text-sm hover:text-white transition">
               {isSignUpMode ? 'Already have an account? Sign In' : "New to PulsePlan? Create account"}
             </button>
           </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-slate-500 text-sm font-medium flex items-center gap-2">
          <span>⚡ Developed by Madhav Prakash</span>
        </footer>
      </div>
    );
  }

  // --- DASHBOARD ---
  const theme = {
    bg: darkMode ? 'bg-slate-900' : 'bg-gray-50',
    text: darkMode ? 'text-slate-100' : 'text-gray-800',
    cardBg: darkMode ? 'bg-slate-800' : 'bg-white',
    cardBorder: darkMode ? 'border-slate-700' : 'border-gray-200',
    subText: darkMode ? 'text-slate-400' : 'text-gray-500',
    inputBg: darkMode ? 'bg-slate-900' : 'bg-gray-50',
    inputBorder: darkMode ? 'border-slate-700' : 'border-gray-200',
    highlight: darkMode ? 'text-cyan-400' : 'text-blue-600',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} py-8 px-4 transition-colors duration-500 flex flex-col`}>
      <div className="max-w-4xl mx-auto w-full flex-grow">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white font-bold text-xl">
               ⚡
             </div>
             <div>
               <h1 className="text-3xl font-extrabold tracking-tight">PulsePlan</h1>
               <p className={`text-xs ${theme.subText} uppercase tracking-widest font-semibold`}>Your Daily Rhythm</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className={`hidden md:block italic ${theme.subText} text-xs text-right max-w-[200px]`}>"{quote}"</p>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full ${theme.cardBg} shadow-md border ${theme.cardBorder} hover:scale-110 transition active:scale-95`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-blue-500`}></div>
            <span className={`text-4xl font-bold ${theme.highlight}`}>{activeCount}</span>
            <span className={`text-sm ${theme.subText} font-medium uppercase tracking-wider mt-1`}>Pulse Active</span>
          </div>
          <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-green-500`}></div>
            <span className="text-4xl font-bold text-green-500">{completedCount}</span>
            <span className={`text-sm ${theme.subText} font-medium uppercase tracking-wider mt-1`}>Completed</span>
          </div>
        </div>

        {/* INPUT */}
        <form onSubmit={handleSubmit} className={`${theme.cardBg} p-6 rounded-2xl shadow-lg mb-8 border ${theme.cardBorder} relative`}>
          <div className="flex flex-col gap-4">
            <input 
              className={`w-full px-5 py-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-lg`}
              value={form.task} 
              onChange={e => setForm({...form, task: e.target.value})} 
              placeholder="What's your next move?" 
            />
            <div className="flex gap-3">
              <input 
                type="date"
                className={`flex-1 px-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none ${theme.subText}`}
                value={form.deadline} 
                onChange={e => setForm({...form, deadline: e.target.value})} 
              />
              <button type="submit" className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 ${editingId ? 'bg-orange-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600'}`}>
                {editingId ? 'Update' : 'Add Pulse'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ task: '', deadline: '' }); }} className="px-4 py-2 bg-slate-600 rounded-xl text-white hover:bg-slate-500">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* LIST */}
        <div className="space-y-3 pb-20">
          {todos.map(t => (
            <div key={t.id} className={`group ${theme.cardBg} p-4 rounded-xl shadow-sm border ${theme.cardBorder} flex items-center justify-between hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleComplete(t)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    t.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-cyan-500'
                  }`}
                >
                  {t.is_completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </button>

                <div className={t.is_completed ? 'opacity-40 grayscale transition duration-500' : ''}>
                  <div className={`font-semibold text-lg ${t.is_completed ? 'line-through decoration-2 decoration-slate-600' : theme.text}`}>
                    {t.task}
                  </div>
                  {t.deadline && (
                    <div className="flex items-center gap-1 text-xs text-orange-400 font-medium mt-1">
                      <span>📅</span> {t.deadline}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <button onClick={() => handleEdit(t)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition" title="Edit">✏️</button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition" title="Delete">🗑️</button>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className={`text-center py-16 ${theme.subText} border-2 border-dashed ${theme.cardBorder} rounded-2xl`}>
              <div className="text-4xl mb-2">⚡</div>
              <p>No pulses active. Start your plan!</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className={`text-center py-6 text-sm font-medium ${theme.subText} border-t ${theme.cardBorder} mt-auto`}>
         ⚡ Developed by Madhav Prakash
      </footer>
    </div>
  );
}