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
      // Artificial delay so you can actually SEE the animation (remove setTimeout for production speed)
      setTimeout(() => setLoading(false), 3000); 
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

  // --- NEW LOADING ANIMATION ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden">
      
      {/* The Track */}
      <div className="w-full max-w-md h-1 bg-slate-700 rounded-full mb-8 relative overflow-hidden">
        {/* The Runner */}
        <div className="absolute top-[-20px] text-4xl animate-accelerate">
          🏃
        </div>
      </div>

      <h2 className="text-2xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Warming up...
      </h2>

      {/* CSS For Acceleration */}
      <style jsx>{`
        @keyframes accelerate {
          0% { left: 0%; transform: translateX(0); animation-timing-function: ease-in; }
          40% { left: 20%; animation-timing-function: linear; } 
          100% { left: 100%; transform: translateX(100%); }
        }
        .animate-accelerate {
          animation: accelerate 2.5s cubic-bezier(0.7, 0, 1, 1) infinite;
        }
      `}</style>
    </div>
  );

  // --- MAIN APP ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 px-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
           <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
             {isSignUpMode ? 'Join Us' : 'Welcome'}
           </h2>
           <div className="space-y-4">
             <input className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Username" value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})} />
             <input type="password" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})} />
             <button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition transform hover:scale-[1.02]">
               {isSignUpMode ? 'Create Account' : 'Login'}
             </button>
             <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full text-gray-400 text-sm hover:text-white">
               {isSignUpMode ? 'Already have an account? Login' : "New? Create an account"}
             </button>
           </div>
        </div>
      </div>
    );
  }

  const theme = {
    bg: darkMode ? 'bg-slate-900' : 'bg-gray-100',
    text: darkMode ? 'text-slate-100' : 'text-gray-800',
    cardBg: darkMode ? 'bg-slate-800' : 'bg-white',
    cardBorder: darkMode ? 'border-slate-700' : 'border-gray-200',
    subText: darkMode ? 'text-slate-400' : 'text-gray-500',
    inputBg: darkMode ? 'bg-slate-900' : 'bg-gray-50',
    inputBorder: darkMode ? 'border-slate-700' : 'border-gray-200',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} py-10 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Task Master
            </h1>
            <p className={`mt-2 italic ${theme.subText} text-sm max-w-md`}>"{quote}"</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full ${theme.cardBg} shadow-lg border ${theme.cardBorder} hover:scale-110 transition`}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center`}>
            <span className="text-4xl font-bold text-blue-500">{activeCount}</span>
            <span className={`text-sm ${theme.subText} font-medium`}>To Do</span>
          </div>
          <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center`}>
            <span className="text-4xl font-bold text-green-500">{completedCount}</span>
            <span className={`text-sm ${theme.subText} font-medium`}>Completed</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`${theme.cardBg} p-6 rounded-2xl shadow-lg mb-8 border ${theme.cardBorder}`}>
          <div className="flex flex-col gap-4">
            <input className={`w-full px-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition`} value={form.task} onChange={e => setForm({...form, task: e.target.value})} placeholder="What needs to be done?" />
            <div className="flex gap-3">
              <input type="date" className={`flex-1 px-4 py-2 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${theme.subText}`} value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              <button type="submit" className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition transform hover:scale-105 ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}>{editingId ? 'Update' : 'Add Task'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ task: '', deadline: '' }); }} className="px-4 py-2 bg-gray-500 rounded-xl text-white">Cancel</button>}
            </div>
          </div>
        </form>

        <div className="space-y-3">
          {todos.map(t => (
            <div key={t.id} className={`group ${theme.cardBg} p-4 rounded-xl shadow-sm border ${theme.cardBorder} flex items-center justify-between hover:shadow-md transition`}>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleComplete(t)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${t.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-blue-500'}`}>
                  {t.is_completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </button>
                <div className={t.is_completed ? 'opacity-50' : ''}>
                  <div className={`font-semibold text-lg ${t.is_completed ? 'line-through text-gray-500' : theme.text}`}>{t.task}</div>
                  {t.deadline && <div className="text-xs text-orange-400 font-medium">Due: {t.deadline}</div>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(t)} className="p-2 text-blue-500 hover:bg-blue-100/10 rounded-lg">✏️</button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-red-500 hover:bg-red-100/10 rounded-lg">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}