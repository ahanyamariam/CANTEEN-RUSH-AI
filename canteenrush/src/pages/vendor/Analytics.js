import React, { useState, useEffect } from 'react';
// Verify this path: It must point to the file containing useAuth
import { useAuth } from '../../context/AuthContext';

import api from '../../api/axios';

export default function Analytics() {
  const { user } = useAuth();
  const [accuracy, setAccuracy] = useState(null);
  const [logs, setLogs] = useState([]);
  const [demand, setDemand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // ─── DATA_RECOVERY_PROTOCOL ───────────────────────────────
  useEffect(() => {
    // We check every possible location for the ID to prevent a crash
    const vId = user?.vendorProfile || user?._id || user?.id;
    
    if (!vId) {
      setErrorMessage("CRITICAL_ERR: NO_VENDOR_ID_DETECTED");
      return;
    }

    const syncData = async () => {
      try {
        const [accRes, logsRes] = await Promise.all([
          api.get(`/predictions/accuracy/${vId}`).catch(() => ({ data: {} })),
          api.get(`/predictions/logs/${vId}`).catch(() => ({ data: { logs: [] } }))
        ]);
        
        setAccuracy(accRes.data?.stats || null);
        setLogs(Array.isArray(logsRes.data?.logs) ? logsRes.data.logs : []);
      } catch (err) {
        setErrorMessage("NETWORK_LOG_FAILURE");
      }
    };

    syncData();
  }, [user]);

  const runDemandModel = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/predictions/demand-analysis');
      setDemand(data);
    } catch (e) {
      setErrorMessage("NEURAL_MODEL_CRASH");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6 lg:p-12 font-sans text-[#1A1A1A]">
      {/* ─── ERROR_OVERLAY ──────────────────────────────────── */}
      {errorMessage && (
        <div className="mb-8 bg-[#FF6B00] p-4 text-white text-[10px] font-black uppercase tracking-widest">
          [!] SYSTEM_FAULT: {errorMessage}
        </div>
      )}

      <header className="mb-16 border-b border-black/10 pb-10">
        <span className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase">Module / 01</span>
        <h1 className="text-6xl font-black tracking-tighter uppercase mt-2">Neural_Analytics</h1>
      </header>

      {/* ─── ACCURACY_GRID ──────────────────────────────────── */}
      <section className="mb-20">
        <h2 className="text-[11px] font-black text-[#FF6B00] uppercase tracking-[0.4em] mb-8">/ PREDICTION_PRECISION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
          <div className="bg-white p-10">
            <p className="text-5xl font-black tracking-tighter">{accuracy?.within3MinAccuracy || 0}%</p>
            <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] mt-6">±3M_LIMIT</p>
          </div>
          <div className="bg-[#D1D9D4] p-10">
            <p className="text-5xl font-black tracking-tighter">{accuracy?.avgErrorMinutes || 0}M</p>
            <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] mt-6">AVG_LATENCY</p>
          </div>
          <div className="bg-white p-10">
            <p className="text-5xl font-black tracking-tighter">{accuracy?.totalPredictions || 0}</p>
            <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] mt-6">SAMPLES</p>
          </div>
        </div>
      </section>

      {/* ─── AI_INSIGHTS_LAB ────────────────────────────────── */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">/ AI_INSIGHTS_LAB</h2>
          <button 
            onClick={runDemandModel} 
            disabled={loading}
            className="bg-[#1A1A1A] text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#FF6B00] disabled:opacity-30 transition-all"
          >
            {loading ? 'EXECUTING...' : 'RUN_ANALYSIS_PROTOCOL [ + ]'}
          </button>
        </div>

        {demand ? (
          <div className="bg-[#D1D9D4] p-10 border border-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 underline underline-offset-8">Peak_Traffic_Windows</p>
                <div className="flex flex-wrap gap-2">
                  {(demand.analysis?.peak_hours || demand.peak_hours || []).map((ph, i) => (
                    <span key={i} className="bg-white border border-black/10 px-4 py-2 text-[10px] font-black uppercase">
                      {ph.hour || ph.time} // {ph.intensity || ph.level}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 underline underline-offset-8">Neural_Insights</p>
                {(demand.analysis?.insights || demand.insights || []).map((ins, i) => (
                  <div key={i} className="border-l-4 border-[#FF6B00] pl-6 py-2 bg-white/20">
                    <p className="text-xs font-bold uppercase italic text-black/70">[LOG] {ins}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 border border-dashed border-black/20 text-center">
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">
               SYSTEM_IDLE // RUN ANALYSIS TO FETCH DATA
            </p>
          </div>
        )}
      </section>
    </div>
  );
}