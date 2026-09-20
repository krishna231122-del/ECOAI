import { Clock, AlertCircle } from "lucide-react";

export default function FutureImpact({ impact }) {
  if (!impact || !Array.isArray(impact) || impact.length === 0) return null;

  // Helper to safely render strings in case the AI generated an object
  const renderListItem = (item) => {
    if (!item) return "";
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') return item;
    if (Array.isArray(item)) return item.map(renderListItem).join(' - ');
    if (typeof item === 'object' && item !== null) {
      try {
        return Object.values(item).map(renderListItem).join(' - ');
      } catch (e) {
        return JSON.stringify(item);
      }
    }
    return String(item);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mt-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="text-orange-400" size={20} /> Future Impact Simulator
      </h3>
      
      <p className="text-sm text-slate-400 mb-8">
        If this environmental issue is ignored, this is the predicted chain of consequences over time.
      </p>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500/50 via-red-500/50 to-red-900/50 hidden sm:block" />
        
        <div className="space-y-6">
          {impact.map((item, index) => {
            const timeframe = renderListItem(item.timeframe);
            const consequence = renderListItem(item.consequence);
            
            // Determine styling based on index (gets progressively more severe)
            let colorClass = "text-orange-400 border-orange-500/30 bg-orange-950/30";
            let dotClass = "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]";
            if (index === 1) {
              colorClass = "text-red-400 border-red-500/30 bg-red-950/30";
              dotClass = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
            } else if (index >= 2) {
              colorClass = "text-red-500 border-red-800/50 bg-red-950/50";
              dotClass = "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]";
            }

            return (
              <div key={index} className="relative sm:pl-12">
                {/* Timeline Dot */}
                <div className={`hidden sm:flex absolute left-[11px] top-4 w-3.5 h-3.5 rounded-full ${dotClass} -translate-x-1/2 z-10`} />
                
                <div className={`border ${colorClass} rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 transition-transform hover:-translate-y-1 duration-300`}>
                  <div className="shrink-0 flex items-center gap-2">
                    <AlertCircle size={16} className={colorClass.split(' ')[0]} />
                    <span className="font-bold text-sm uppercase tracking-widest">{timeframe}</span>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed border-l-0 sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 w-full">
                    {consequence}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
