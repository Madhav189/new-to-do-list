export default function TaskItem({ task, theme, onToggle, onEdit, onDelete }) {
  const getPriorityColor = (p) => {
    if (p === 'high') return 'bg-red-500 text-white';
    if (p === 'low') return 'bg-blue-500 text-white';
    return 'bg-yellow-500 text-black'; 
  };

  return (
    <div className={`group ${theme.cardBg} p-4 rounded-xl shadow-sm border ${theme.cardBorder} flex items-center justify-between hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <button onClick={() => onToggle(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-cyan-500'}`}>
          {task.is_completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
        </button>
        <div className={task.is_completed ? 'opacity-40 grayscale transition duration-500' : ''}>
          <div className={`font-semibold text-lg ${task.is_completed ? 'line-through decoration-2 decoration-slate-600' : theme.text} flex items-center gap-2`}>
            {task.task}
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>{task.priority || 'medium'}</span>
          </div>
          {task.deadline && <div className="flex items-center gap-1 text-xs text-orange-400 font-medium mt-1"><span>📅</span> {task.deadline}</div>}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
        <button onClick={() => onEdit(task)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition">✏️</button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">🗑️</button>
      </div>
    </div>
  );
}