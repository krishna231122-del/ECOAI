import { useState, useEffect } from "react";
import { MapPin, Building, ShieldAlert, ArrowRight } from "lucide-react";
import { getLocalAuthority } from "../lib/localAuthorities";

export default function LocalAction({ analysis }) {
  const [country, setCountry] = useState("India");
  const [region, setRegion] = useState("Uttarakhand");
  const [city, setCity] = useState("Dehradun");
  const [authority, setAuthority] = useState(null);

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

  const detectedIssue = renderListItem(analysis?.issue) || "Environmental Anomaly";

  useEffect(() => {
    if (country) {
      const result = getLocalAuthority(country, region, city, detectedIssue);
      setAuthority(result);
    } else {
      setAuthority(null);
    }
  }, [country, region, city, detectedIssue]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mt-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MapPin className="text-red-400" size={20} /> Local Action Context
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Location Selection */}
        <div className="space-y-4">
          <p className="text-sm text-slate-400 mb-4">
            Select the location of the observation to identify the relevant local authority.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Country</label>
              <input 
                type="text" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">State / Region</label>
                <input 
                  type="text" 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Uttarakhand"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dehradun"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identified Authority */}
        <div className="bg-slate-950/40 p-6 rounded-2xl border border-emerald-900/30 flex flex-col justify-center relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Building size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <ShieldAlert size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Suggested Authority</span>
            </div>
            
            {authority ? (
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-slate-400">Organization</p>
                  <p className="text-xl font-bold text-white">{authority.authority}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Department</p>
                  <p className="text-lg font-medium text-emerald-100/90 flex items-center gap-2">
                    <ArrowRight size={14} className="text-emerald-500" />
                    {authority.department}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 mt-4">
                  <p className="text-xs text-slate-500 italic">
                    EcoWatch identified the local authority that may be relevant to this environmental issue. 
                    This information is provided for context and educational purposes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-slate-400">Please enter a country to identify the relevant local authority.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
