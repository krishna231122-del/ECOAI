import { Search, Eye, AlertTriangle, BookOpen, Download } from "lucide-react";
import SeverityScore from "./SeverityScore";
import ActionPlan from "./ActionPlan";
import ImpactVisualization from "./ImpactVisualization";

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

export default function AnalysisDashboard({ result, isDownloadingPdf, generatePDF, onReset }) {
  if (!result) return null;

  return (
    <div id="report-dashboard" className="w-full max-w-5xl mx-auto mt-8 animate-in slide-in-from-bottom-10 fade-in duration-1000">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Detected Issue
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {renderListItem(result.issue) || "Environmental Anomaly"}
          </h3>
        </div>

        <div className="flex gap-4" data-html2canvas-ignore="true">
          <button
            onClick={generatePDF}
            disabled={isDownloadingPdf}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isDownloadingPdf ? "Saving..." : "Download Report"}
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Start New Analysis
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Row: Severity Score */}
        <SeverityScore 
          score={result.severityScore || 50} 
          label={renderListItem(result.severityLabel) || "Medium"} 
          confidence={renderListItem(result.confidence) || "Medium"} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Evidence / Observations */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye className="text-blue-400" size={20} /> AI Observations
            </h3>
            <ul className="space-y-3">
              {(result.observations || result.evidence || []).map((obs, i) => (
                <li key={i} className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span className="text-slate-300 text-sm leading-relaxed">{renderListItem(obs)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Search className="text-yellow-400" size={20} /> Potential Causes
            </h3>
            <ul className="space-y-3">
              {(result.possibleCauses || []).map((cause, i) => (
                <li key={i} className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <span className="text-slate-300 text-sm leading-relaxed">{renderListItem(cause)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Research Agent */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-purple-400" size={20} /> Understand the Problem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Research Findings</h4>
              <ul className="space-y-3">
                {(result.researchFindings || result.research || []).map((fact, i) => (
                  <li key={i} className="text-slate-300 text-sm leading-relaxed border-l-2 border-purple-500/50 pl-4 py-1">
                    {renderListItem(fact)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sources</h4>
              <ul className="space-y-3">
                {(result.researchSources || result.sources || []).map((source, i) => (
                  <li key={i} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 text-slate-400 text-xs flex items-center gap-2">
                    <BookOpen size={12} className="text-slate-500 shrink-0" />
                    {renderListItem(source)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Plan & Timeline */}
        <ActionPlan actionPlan={result.actionPlan} timeline={result.timeline} />

        {/* Impact Visualization */}
        <ImpactVisualization impact={result.impactVisualization} />

      </div>
    </div>
  );
}
