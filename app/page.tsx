"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import InteractiveBackground from "@/components/InteractiveBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  Leaf, AlertTriangle, Eye, Activity, Search, 
  Lightbulb, ArrowRight, BookOpen, Target, CheckCircle2, ChevronRight, Droplets, Wind,
  Waves, Trash2, TreePine, CloudFog, Sprout, Bug, Check, Box, Workflow, Code2, Cpu,
  Download, MapPin
} from "lucide-react";
import AgentWorkflow from "@/components/AgentWorkflow";
import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const generatePDF = async () => {
    const element = document.getElementById('report-dashboard');
    if (!element) return;
    
    setIsDownloadingPdf(true);
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const imgData = await toPng(element, { 
        backgroundColor: '#020617',
        pixelRatio: 2,
        filter: (node) => {
          // Ignore buttons marked with data-html2canvas-ignore
          if (node?.getAttribute && node.getAttribute('data-html2canvas-ignore') === 'true') {
            return false;
          }
          return true;
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ecowatch-report.pdf');
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Simulated agent loading workflow
  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    if (isAnalyzing) {
      setLoadingStep(1); // 1 = Image uploaded
      timers.push(setTimeout(() => setLoadingStep(2), 1500)); // Vision Agent
      timers.push(setTimeout(() => setLoadingStep(3), 4000)); // Research Agent
      timers.push(setTimeout(() => setLoadingStep(4), 6500)); // Solution Agent
      timers.push(setTimeout(() => setLoadingStep(5), 9000)); // Impact Analysis
    } else {
      setLoadingStep(0);
    }
    return () => timers.forEach(clearTimeout);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }
      
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-950/40 border-red-900/50';
      case 'high': return 'text-orange-400 bg-orange-950/40 border-orange-900/50';
      case 'medium': return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
      case 'low': return 'text-green-400 bg-green-950/40 border-green-900/50';
      default: return 'text-slate-400 bg-slate-900/40 border-slate-800';
    }
  };

  const renderListItem = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      if (item.shortTerm && item.longTerm) {
        return `Short term: ${item.shortTerm} | Long term: ${item.longTerm}`;
      }
      return item.description || item.step || item.title || item.fact || item.cause || item.observation || item.solution || JSON.stringify(item);
    }
    return String(item);
  };

  const goHome = () => {
    setResult(null);
    setFile(null);
    setLoadingStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (result) {
      setResult(null);
      setFile(null);
      setLoadingStep(0);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-eco-500/30 selection:text-eco-100 relative text-slate-300">
      
      <InteractiveBackground />

      {/* Background gradients and animations */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-eco-900/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none animate-blob-reverse" />
        
        {/* Floating Particles/Leaves */}
        <div className="absolute left-[15%] w-3 h-3 bg-eco-500/20 rounded-full blur-[1px] animate-float" />
        <div className="absolute left-[85%] w-4 h-4 bg-emerald-500/20 rounded-full blur-[2px] animate-float-delayed" />
        <div className="absolute left-[50%] w-2 h-2 bg-blue-400/20 rounded-full blur-[1px] animate-float-slow" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl transition-all duration-300 hover:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={goHome} className="flex items-center gap-2 text-white font-bold text-xl tracking-tight cursor-pointer hover:text-eco-400 transition-colors">
            <Leaf className="text-eco-500" />
            EcoWatch AI
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className="hover:text-white transition-colors">How it works</a>
            <a href="#technology" onClick={(e) => handleNavClick(e, "technology")} className="hover:text-white transition-colors">Technology</a>
          </div>
          <button 
            onClick={(e) => handleNavClick(e as any, "upload-section")}
            className="hidden md:block bg-white text-slate-950 hover:bg-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Analysis
          </button>
        </div>
      </nav>

      {!result && (
        <div className="absolute top-0 left-0 w-full h-[100vh] min-h-[800px] z-[-1] pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-100 animate-in fade-in duration-[2000ms]" 
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
        </div>
      )}

      <main className="pt-32 pb-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto relative">
        {!result ? (
          <div className="flex flex-col items-center w-full">
            
            {/* 1. HERO SECTION */}
            <ScrollReveal direction="up" delay={100} className="w-full text-center max-w-3xl mb-16 pt-10">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                See what's happening to our <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-400 to-emerald-600">planet.</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-300 mb-6">
                Let AI understand it and help you act.
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Upload an image of an environmental problem and EcoWatch AI will analyze it, research the issue, and generate practical solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-eco-600 hover:bg-eco-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  Analyze an Image
                </button>
                <button 
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  See How It Works
                </button>
              </div>
            </ScrollReveal>

            {/* UPLOAD SECTION */}
            <ScrollReveal direction="up" delay={200} className="w-full max-w-4xl">
              <div id="upload-section" className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-2 sm:p-4 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <ImageUpload 
                  onImageSelected={(selectedFile) => {
                    setFile(selectedFile);
                    setError(null);
                  }} 
                  isLoading={isAnalyzing}
                />

                {error && (
                  <div className="mx-6 mt-4 p-4 bg-red-950/50 text-red-400 rounded-2xl border border-red-900/50 flex items-center gap-3">
                    <AlertTriangle size={20} className="shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}
                
                {isAnalyzing ? (
                  <AgentWorkflow loadingStep={loadingStep} />
                ) : (
                  <div className={`mt-6 mb-2 px-6 flex justify-end transition-opacity duration-500 ${file ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                      onClick={handleAnalyze}
                      disabled={!file}
                      className="flex items-center gap-2 px-8 py-4 bg-eco-600 hover:bg-eco-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                      Analyze Environment
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* 2. HOW IT WORKS */}
            <div id="how-it-works" className="w-full max-w-6xl mt-48 mb-24">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="text-sm font-bold tracking-widest uppercase text-eco-500 mb-4">From Image to Action</h2>
                  <h3 className="text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
                    Three AI-powered steps turn an environmental observation into a practical response.
                  </h3>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Connecting Line */}
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-amber-500/20" />
                  
                  <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-8 rounded-3xl relative z-10 text-center flex flex-col items-center hover:border-blue-500/50 transition-colors duration-500 group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500">
                      <Eye className="text-blue-400" size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">01 — Vision AI</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Analyze the uploaded image and identify visible environmental problems.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-8 rounded-3xl relative z-10 text-center flex flex-col items-center hover:border-purple-500/50 transition-colors duration-500 group">
                    <div className="w-16 h-16 rounded-2xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform duration-500">
                      <Search className="text-purple-400" size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">02 — Eco Research</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Research the detected issue using relevant environmental information and sources.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-8 rounded-3xl relative z-10 text-center flex flex-col items-center hover:border-amber-500/50 transition-colors duration-500 group">
                    <div className="w-16 h-16 rounded-2xl bg-amber-900/50 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform duration-500">
                      <Lightbulb className="text-amber-400" size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">03 — Actionable Solutions</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Turn the findings into practical recommendations and an action plan.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            {/* 2.5 LOCAL ENVIRONMENTAL CONTEXT */}
            <div className="w-full max-w-6xl my-24 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <MapPin size={200} />
              </div>
              <ScrollReveal direction="up">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <MapPin className="text-emerald-400" size={32} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Local Environmental Context</h3>
                  <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-12">
                    EcoWatch connects environmental observations with the local authorities and organizations that may be relevant to addressing them.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 font-bold text-sm md:text-base">
                    <span className="bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-lg text-blue-400">DETECT</span>
                    <ArrowRight size={16} className="text-slate-600 hidden sm:block" />
                    <span className="bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-lg text-purple-400">UNDERSTAND</span>
                    <ArrowRight size={16} className="text-slate-600 hidden sm:block" />
                    <span className="bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-lg text-amber-400">RESEARCH</span>
                    <ArrowRight size={16} className="text-slate-600 hidden sm:block" />
                    <span className="bg-emerald-950/60 border border-emerald-900/50 px-4 py-2 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">IDENTIFY LOCAL AUTHORITY</span>
                    <ArrowRight size={16} className="text-slate-600 hidden sm:block" />
                    <span className="bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-lg text-white">ACT</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* 3. WHAT CAN ECOWATCH DETECT */}
            <div className="w-full max-w-6xl my-32">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-bold text-white">One Image. Multiple Environmental Insights.</h3>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <Waves size={24} className="text-blue-400" />, title: "Water Pollution", desc: "Detects oil spills, algal blooms, and abnormal water coloration." },
                  { icon: <Trash2 size={24} className="text-orange-400" />, title: "Waste & Plastic", desc: "Identifies illegal dumping and plastic accumulation." },
                  { icon: <TreePine size={24} className="text-emerald-400" />, title: "Deforestation", desc: "Spots illegal logging and habitat destruction." },
                  { icon: <CloudFog size={24} className="text-slate-400" />, title: "Air Pollution", desc: "Detects severe smog, industrial emissions, and smoke." },
                  { icon: <Sprout size={24} className="text-amber-400" />, title: "Soil & Agriculture", desc: "Identifies severe soil erosion and degradation." },
                  { icon: <Bug size={24} className="text-red-400" />, title: "Ecosystem Damage", desc: "Monitors general indicators of ecosystem health decline." }
                ].map((item, i) => (
                  <ScrollReveal key={i} direction="up" delay={i * 100}>
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-800/60 hover:border-eco-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-300 group cursor-default">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* 4. EXAMPLE ANALYSIS */}
            <div className="w-full max-w-6xl my-32">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">See EcoWatch in Action</h3>
                  <p className="text-slate-400 text-lg">A realistic simulation of our AI pipeline.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={200}>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-[3rem] p-4 sm:p-8 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Fake Image Placeholder */}
                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative h-64 lg:h-auto flex items-center justify-center group">
                      <img 
                        src="/sample-waste.jpg" 
                        alt="Urban waste accumulation example"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="relative z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-300 tracking-wider">
                        SAMPLE IMAGE
                      </div>
                    </div>

                    {/* Fake Results */}
                    <div className="space-y-6 lg:p-4">
                      <div>
                        <h4 className="text-xs font-bold text-eco-500 uppercase tracking-wider mb-1">Detected Issue</h4>
                        <h3 className="text-3xl font-extrabold text-white">Urban Waste Accumulation</h3>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-red-400 bg-red-950/40 border-red-900/50">
                          Critical
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Observations</h4>
                        <ul className="space-y-2">
                          {["Large pile of unsegregated waste on the street", "Proximity to traffic and pedestrians", "Includes plastics, organic waste, and potential hazards"].map((obs, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              {obs}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recommended Actions</h4>
                        <ul className="space-y-3">
                          {["Deploy municipal waste collection immediately", "Install segregated public waste bins", "Implement community awareness programs", "Monitor the area regularly"].map((act, i) => (
                            <li key={i} className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800/50 text-sm text-slate-300">
                              <Check size={14} className="text-emerald-500" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 mt-6 border-t border-slate-800/60">
                        <button 
                          onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: 'smooth' })}
                          className="w-full bg-eco-600/10 hover:bg-eco-600/20 border border-eco-500/30 text-eco-400 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                        >
                          Try Your Own Image <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>


            {/* 6. TECHNOLOGY */}
            <div id="technology" className="w-full max-w-6xl my-32">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Powered by Modern AI</h3>
                  <p className="text-slate-400 text-lg">Built with state-of-the-art tools for maximum speed and intelligence.</p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <Eye size={24} className="text-blue-400" />, title: "Vision AI", desc: "Multimodal image understanding." },
                  { icon: <Search size={24} className="text-purple-400" />, title: "AI Research", desc: "Evidence-based environmental research." },
                  { icon: <Workflow size={24} className="text-amber-400" />, title: "Agentic Workflow", desc: "Multiple AI stages working together." },
                  { icon: <Code2 size={24} className="text-slate-200" />, title: "Next.js", desc: "Fast full-stack application architecture." },
                  { icon: <Cpu size={24} className="text-emerald-400" />, title: "Vercel AI SDK", desc: "AI orchestration and structured outputs." },
                  { icon: <Box size={24} className="text-blue-500" />, title: "Tailwind CSS", desc: "Premium, responsive styling system." }
                ].map((tech, i) => (
                  <ScrollReveal key={i} direction="up" delay={i * 100}>
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-800/60 hover:border-slate-600 transition-all">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {tech.icon}
                        </div>
                        <h4 className="text-lg font-bold text-white">{tech.title}</h4>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {tech.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* 7. WHY ECOWATCH */}
            <div className="w-full max-w-5xl my-32">
              <ScrollReveal direction="up">
                <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                  {/* Subtle Background Icon */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <Leaf size={400} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                    <div>
                      <h4 className="text-eco-500 font-bold uppercase tracking-wider text-sm mb-4">The Problem</h4>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                        Environmental problems are often visible before they are properly understood.
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        Without context or actionable advice, spotting an issue like localized pollution or habitat damage rarely leads to a practical resolution. People want to help, but lack the specialized knowledge to act.
                      </p>
                    </div>

                    <div className="relative">
                      {/* Animated connecting line for desktop */}
                      <div className="hidden md:block absolute top-8 -left-[4.5rem] w-[4.5rem] h-[2px] bg-gradient-to-r from-slate-800 to-eco-500/50" />
                      <div className="hidden md:block absolute top-8 -left-4 w-2 h-2 rounded-full bg-eco-500 animate-pulse" />
                      
                      <h4 className="text-eco-500 font-bold uppercase tracking-wider text-sm mb-4">Our Approach</h4>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                        EcoWatch turns a simple image into actionable intelligence.
                      </h3>
                      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-2 text-sm font-medium text-slate-300">
                        <span className="text-blue-400">Observation</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-purple-400">Understanding</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-emerald-400">Action</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* 8. FINAL CTA */}
            <div className="w-full max-w-4xl my-32 text-center relative">
              <ScrollReveal direction="up">
                <div className="absolute inset-0 bg-eco-500/10 blur-[100px] rounded-full z-[-1] pointer-events-none" />
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Have you spotted an environmental problem?
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Upload an image and let EcoWatch help you understand what you're seeing.
                </p>
                <button 
                  onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white hover:bg-slate-200 text-slate-950 px-10 py-5 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  Start an Analysis →
                </button>
              </ScrollReveal>
            </div>

          </div>
        ) : (
          <AnalysisDashboard 
            result={result} 
            isDownloadingPdf={isDownloadingPdf} 
            generatePDF={generatePDF} 
            onReset={() => {
              setResult(null);
              setFile(null);
              setLoadingStep(0);
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      {!result && (
        <footer className="w-full border-t border-slate-800/50 bg-slate-950/60 backdrop-blur-xl mt-16 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-xl tracking-tight mb-2">
                <Leaf className="text-eco-500" />
                EcoWatch AI
              </div>
              <p className="text-slate-400 text-sm">See environmental problems. Understand them. Act.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400">
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">How It Works</a>
              <a href="#technology" onClick={(e) => { e.preventDefault(); document.getElementById("technology")?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Technology</a>
              <button onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-eco-400">Start Analysis</button>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
            EcoWatch AI &copy; 2026
          </div>
        </footer>
      )}
    </div>
  );
}
