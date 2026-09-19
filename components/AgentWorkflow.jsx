import { Camera, Eye, Search, BrainCircuit, Lightbulb, CheckCircle2 } from "lucide-react";

export default function AgentWorkflow({ loadingStep }) {
  const steps = [
    { step: 1, title: "Image Uploaded", desc: "Acquiring environmental data", icon: Camera },
    { step: 2, title: "Vision Agent", desc: "Analyzing image for visible issues", icon: Eye },
    { step: 3, title: "Research Agent", desc: "Gathering environmental evidence", icon: Search },
    { step: 4, title: "Reasoning", desc: "Understanding context & severity", icon: BrainCircuit },
    { step: 5, title: "Solution Agent", desc: "Creating local action plan", icon: Lightbulb }
  ];

  return (
    <div className="w-full max-w-md mx-auto my-12 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 animate-pulse-slow" />
      
      <h3 className="text-xl font-bold text-white mb-8 text-center">AI Agents at Work</h3>
      
      <div className="space-y-0 relative">
        {steps.map((s, index) => {
          const isCompleted = loadingStep > s.step;
          const isActive = loadingStep === s.step;
          const isPending = loadingStep < s.step;
          const isLast = index === steps.length - 1;

          const Icon = s.icon;

          return (
            <div key={s.step} className="relative flex items-start gap-6 pb-8">
              {/* Vertical connecting line */}
              {!isLast && (
                <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-800 rounded-full">
                  {(isCompleted || isActive) && (
                    <div className={`absolute top-0 left-0 w-full rounded-full transition-all duration-1000 bg-emerald-500 ${isCompleted ? 'h-full' : 'h-1/2 opacity-50'}`} />
                  )}
                </div>
              )}

              {/* Node Icon */}
              <div className={`relative z-10 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                'bg-slate-950 border border-slate-800 text-slate-600'
              }`}>
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} className={isActive ? "animate-pulse" : ""} />}
              </div>

              {/* Node Content */}
              <div className="pt-2">
                <h4 className={`text-base font-bold transition-colors duration-300 ${isCompleted || isActive ? 'text-white' : 'text-slate-500'}`}>
                  {s.title}
                </h4>
                <p className={`text-sm mt-1 transition-colors duration-300 ${isCompleted ? 'text-emerald-500/80' : isActive ? 'text-blue-400/80 animate-pulse' : 'text-slate-600'}`}>
                  {isActive ? 'Processing...' : isPending ? 'Pending' : s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
