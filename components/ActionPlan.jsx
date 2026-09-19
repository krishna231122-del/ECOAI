"use client";
import { useState } from "react";
import { User, Users, Building2, Calendar, Clock, Target, ArrowRight } from "lucide-react";

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

export default function ActionPlan({ actionPlan, timeline }) {
  const [activeTab, setActiveTab] = useState("individual");

  const tabs = [
    { id: "individual", label: "Individual", icon: User },
    { id: "community", label: "Community", icon: Users },
    { id: "municipality", label: "Municipality", icon: Building2 },
  ];

  return (
    <div className="space-y-8">
      {/* Scope Selector */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Turn Insight Into Action</h3>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {actionPlan?.[activeTab]?.map((action, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
              <ArrowRight className="text-emerald-500 mt-0.5 shrink-0" size={18} />
              <p className="text-slate-300 text-sm leading-relaxed">{renderListItem(action)}</p>
            </div>
          ))}
          {(!actionPlan?.[activeTab] || actionPlan?.[activeTab].length === 0) && (
            <p className="text-slate-500 text-sm italic">No specific actions available for this scope.</p>
          )}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-8">Action Timeline</h3>
        
        <div className="space-y-0 relative pl-4 sm:pl-0">
          {/* Vertical connecting line */}
          <div className="absolute left-6 sm:left-[118px] top-6 bottom-6 w-0.5 bg-slate-800/80 rounded-full" />

          {/* Timeline Nodes */}
          {[
            { id: "today", label: "TODAY", icon: Clock, data: timeline?.today },
            { id: "thisWeek", label: "THIS WEEK", icon: Calendar, data: timeline?.thisWeek },
            { id: "thisMonth", label: "THIS MONTH", icon: Calendar, data: timeline?.thisMonth },
            { id: "longTerm", label: "LONG TERM", icon: Target, data: timeline?.longTerm }
          ].map((stage, idx) => {
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="relative flex flex-col sm:flex-row sm:items-start gap-6 pb-12 group">
                <div className="sm:w-20 pt-2 shrink-0 hidden sm:block text-right">
                  <span className="text-xs font-bold text-slate-500 tracking-wider group-hover:text-emerald-400 transition-colors">
                    {stage.label}
                  </span>
                </div>

                <div className="relative z-10 w-6 h-6 shrink-0 rounded-full bg-slate-950 border-2 border-emerald-500 flex items-center justify-center mt-1 -ml-1 sm:ml-0 shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div className="flex-1 -mt-1 sm:mt-0">
                  <span className="text-xs font-bold text-emerald-400 tracking-wider mb-3 block sm:hidden">
                    {stage.label}
                  </span>
                  <div className="space-y-3">
                    {stage.data?.map((item, i) => (
                      <div key={i} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 hover:border-emerald-500/30 transition-colors">
                        <p className="text-slate-300 text-sm leading-relaxed">{renderListItem(item)}</p>
                      </div>
                    ))}
                    {(!stage.data || stage.data.length === 0) && (
                      <p className="text-slate-500 text-sm italic">Continuous monitoring</p>
                    )}
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
