export default function SeverityScore({ score, label, confidence }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (score >= 40) colorClass = "text-yellow-500";
  if (score >= 70) colorClass = "text-orange-500";
  if (score >= 85) colorClass = "text-red-500";

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-xl">
      
      {/* Circular Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1500 ease-out ${colorClass}`}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">/ 100</span>
        </div>
      </div>

      {/* Info Details */}
      <div className="flex-1 space-y-6 text-center sm:text-left">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Environmental Severity</h4>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-widest ${
              score >= 85 ? 'text-red-400 bg-red-950/40 border-red-900/50' :
              score >= 70 ? 'text-orange-400 bg-orange-950/40 border-orange-900/50' :
              score >= 40 ? 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50' :
              'text-emerald-400 bg-emerald-950/40 border-emerald-900/50'
            }`}>
              {label}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Assessment Confidence</h4>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-widest ${
              confidence?.toLowerCase() === 'high' ? 'text-blue-400 bg-blue-950/40 border-blue-900/50' :
              confidence?.toLowerCase() === 'medium' ? 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50' :
              'text-slate-400 bg-slate-900/40 border-slate-800/50'
            }`}>
              {confidence}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto sm:mx-0">
            * This score is an AI-generated assessment based purely on visible evidence and does not replace scientific field measurements.
          </p>
        </div>
      </div>
    </div>
  );
}
