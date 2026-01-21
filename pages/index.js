import { useState, useEffect } from 'react';
import Head from 'next/head'; 
import toast, { Toaster } from 'react-hot-toast';

// Import our new Modular Components
import Loading from '../components/Loading';
import AuthForm from '../components/AuthForm';
import Stats from '../components/Stats';
import TaskItem from '../components/TaskItem';

const QUOTES = ["Consistency is key.", "Small steps matter.", "Keep going.", "Start today."];

export default function Home() {
  // --- STATE (Logic) ---
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ task: '', deadline: '', priority: 'medium' });
  const [editingId, setEditingId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [quote, setQuote] = useState('');

  // --- EFFECTS ---
  useEffect(() => { 
    fetchTodos(); 
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // --- API HANDLERS ---
  const fetchTodos = () => {
    fetch('/api/todos').then(res => {
      if (res.ok) {
        setIsLoggedIn(true);
        res.json().then(data => {
            const formatted = data.map(t => ({...t, deadline: t.deadline ? t.deadline.split('T')[0] : ''}));
            setTodos(formatted);
        });
      }
      setTimeout(() => setLoading(false), 1500); 
    });
  };

  const handleAuth = async (creds, isSignUp) => {
    const toastId = toast.loading('Authenticating...');
    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) });
    toast.dismiss(toastId);
    if (res.ok) {
      if (isSignUp) { toast.success('Created! Log in now.'); } 
      else { toast.success('Welcome!'); window.location.reload(); }
    } else { toast.error('Failed.'); }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout');
      if (res.ok) {
        // If successful, force a full page navigation to the home page
        window.location.href = "/";
      } else {
        alert("Logout failed! The API file might be missing.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.task) return toast.error('Enter task!');
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId 
      ? { ...form, id: editingId, is_completed: todos.find(t => t.id === editingId).is_completed } 
      : form;

    await fetch('/api/todos', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    toast.success(editingId ? 'Updated!' : 'Added!');
    setEditingId(null);
    setForm({ task: '', deadline: '', priority: 'medium' });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    const newStatus = !todo.is_completed;
    setTodos(todos.map(t => t.id === todo.id ? { ...t, is_completed: newStatus } : t));
    if(newStatus) toast.success('Completed!');
    await fetch('/api/todos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...todo, is_completed: newStatus }) });
    fetchTodos(); 
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    toast.success('Deleted.');
    fetchTodos();
  };

  // --- THEME ---
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

  // --- RENDER ---
  if (loading) return <Loading />;
  if (!isLoggedIn) return <AuthForm onAuth={handleAuth} />;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} py-8 px-4 transition-colors duration-500 flex flex-col`}>
      <Head><title>PulsePlan ⚡</title></Head>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <div className="max-w-4xl mx-auto w-full flex-grow">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg text-white font-bold text-xl">⚡</div>
             <div><h1 className="text-3xl font-extrabold">PulsePlan</h1><p className={`text-xs ${theme.subText} uppercase tracking-widest font-semibold`}>Your Daily Rhythm</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full ${theme.cardBg} border ${theme.cardBorder}`}>{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={handleLogout} className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition border border-red-500/20">Exit</button>
          </div>
        </div>

        {/* MODULAR COMPONENTS IN ACTION */}
        <Stats active={todos.length - todos.filter(t => t.is_completed).length} completed={todos.filter(t => t.is_completed).length} theme={theme} />

        {/* INPUT FORM (Ideally this moves to its own component too!) */}
        <form onSubmit={handleSubmit} className={`${theme.cardBg} p-6 rounded-2xl shadow-lg mb-8 border ${theme.cardBorder}`}>
          <div className="flex flex-col gap-4">
            <input className={`w-full px-5 py-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-lg`} value={form.task} onChange={e => setForm({...form, task: e.target.value})} placeholder="What's your next move?" />
            <div className="flex flex-wrap gap-3">
              <input type="date" className={`flex-1 px-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl outline-none ${theme.subText}`} value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              <select className={`px-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl outline-none ${theme.subText}`} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🔵 Low</option>
              </select>
              <button type="submit" className={`flex-1 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 ${editingId ? 'bg-orange-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600'}`}>{editingId ? 'Update' : 'Add Pulse'}</button>
            </div>
          </div>
        </form>

        {/* LIST */}
        <div className="space-y-3 pb-20">
          {todos.map(t => (
            <TaskItem 
              key={t.id} 
              task={t} 
              theme={theme} 
              onToggle={toggleComplete} 
              onEdit={(task) => { setEditingId(task.id); setForm({ task: task.task, deadline: task.deadline || '', priority: task.priority || 'medium' }); }} 
              onDelete={handleDelete} 
            />
          ))}
          {todos.length === 0 && <div className={`text-center py-16 ${theme.subText} border-2 border-dashed ${theme.cardBorder} rounded-2xl`}>No pulses active.</div>}
        </div>
      </div>
      <footer className={`text-center py-6 text-sm font-medium ${theme.subText} border-t ${theme.cardBorder} mt-auto`}>⚡ Developed by Madhav Prakash</footer>
    </div>
  );
}