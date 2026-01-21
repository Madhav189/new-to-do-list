export default function Stats({ active, completed, theme }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <span className={`text-4xl font-bold ${theme.highlight}`}>{active}</span>
        <span className={`text-sm ${theme.subText} font-medium uppercase tracking-wider mt-1`}>Active</span>
      </div>
      <div className={`${theme.cardBg} p-6 rounded-2xl shadow-sm border ${theme.cardBorder} flex flex-col items-center justify-center relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
        <span className="text-4xl font-bold text-green-500">{completed}</span>
        <span className={`text-sm ${theme.subText} font-medium uppercase tracking-wider mt-1`}>Done</span>
      </div>
    </div>
  );
}