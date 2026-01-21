import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function AuthForm({ onAuth, loading }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });

  const handleSubmit = () => onAuth(creds, isSignUp);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-blue-900 mb-2 tracking-tight">PulsePlan<span className="text-blue-500">.</span></h1>
          <p className="text-blue-700/60 text-sm font-medium">Organize your life rhythm.</p>
        </div>
        <div className="space-y-4">
          <input className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium outline-none focus:ring-4 focus:ring-blue-500/20" 
            placeholder="Username" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})} />
          <input type="password" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium outline-none focus:ring-4 focus:ring-blue-500/20" 
            placeholder="Password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} />
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition transform hover:scale-[1.02]">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-gray-500 text-sm hover:text-blue-600 transition font-medium">
            {isSignUp ? 'Already have an account? Sign In' : "New here? Create account"}
          </button>
        </div>
      </div>
      <footer className="mt-12 text-slate-500 text-sm font-medium">⚡ Developed by Madhav Prakash</footer>
    </div>
  );
}