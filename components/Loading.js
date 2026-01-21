import Head from 'next/head';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white overflow-hidden">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-widest text-white">
          PulsePlan<span className="text-blue-500">.</span>
        </h1>
      </div>
      <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-blue-500 animate-loading-bar rounded-full"></div>
      </div>
      <p className="text-neutral-500 text-xs font-medium tracking-widest uppercase animate-pulse">
        Loading your tasks...
      </p>
      <style jsx>{`
        @keyframes loading-bar { 0% { width: 0%; opacity: 0; } 20% { width: 10%; opacity: 1; } 50% { width: 60%; } 100% { width: 100%; } }
        .animate-loading-bar { animation: loading-bar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}