import { AlertCircle, ArrowDown, Sparkles, CheckCircle2 } from "lucide-react";

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

export default function ImpactVisualization({ impact }) {
  if (!impact) return null;

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">Potential Impact</h3>
      <p className="text-sm text-slate-400 mb-8">* These are potential qualitative outcomes of taking action, not guaranteed results.</p>
      
      <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
        
        {/* Current Situation */}
        <div className="w-full bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-3">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Current Situation</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{renderListItem(impact.currentSituation)}</p>
        </div>

        {/* Arrow Down */}
        <div className="h-10 w-px bg-gradient-to-b from-slate-800 to-blue-500/50 relative my-2">
          <ArrowDown className="absolute -bottom-4 -left-2.5 text-blue-500/50" size={20} />
        </div>

        {/* Intervention */}
        <div className="w-full bg-blue-950/20 p-6 rounded-2xl border border-blue-900/30 mt-6">
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-3">
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Cleanup / Intervention</span>
          </div>
          <p className="text-blue-100/80 text-sm leading-relaxed">{renderListItem(impact.intervention)}</p>
        </div>

        {/* Arrow Down */}
        <div className="h-10 w-px bg-gradient-to-b from-blue-900/30 to-emerald-500/50 relative my-2">
          <ArrowDown className="absolute -bottom-4 -left-2.5 text-emerald-500/50" size={20} />
        </div>

        {/* Potential Outcomes */}
        <div className="w-full bg-emerald-950/20 p-6 rounded-2xl border border-emerald-900/30 mt-6">
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-5">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Potential Outcomes</span>
          </div>
          <div className="space-y-3 text-left">
            {impact.potentialOutcomes?.map((outcome, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                <p className="text-emerald-100/90 text-sm leading-relaxed">{renderListItem(outcome)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
