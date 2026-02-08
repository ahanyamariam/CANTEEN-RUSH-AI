import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Analytics() {
  const { user } = useAuth();
  const [accuracy, setAccuracy] = useState(null);
  const [logs, setLogs] = useState([]);
  const [demand, setDemand] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [loadingDemand, setLoadingDemand] = useState(false);

  useEffect(() => {
    if (!user?.vendorProfile) return;
    api.get(`/predictions/accuracy/${user.vendorProfile}`).then((r) => setAccuracy(r.data.stats)).catch(console.error).finally(() => setLoadingAcc(false));
    api.get(`/predictions/logs/${user.vendorProfile}`).then((r) => setLogs(r.data.logs || [])).catch(console.error);
  }, [user]);

  const runDemand = async () => {
    setLoadingDemand(true);
    try { const { data } = await api.get('/predictions/demand-analysis'); setDemand(data); }
    catch (e) { console.error(e); }
    finally { setLoadingDemand(false); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-black text-white mb-6 pt-2">AI Analytics</h1>

      {/* Accuracy */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">🎯 Prediction Accuracy</h2>
        {loadingAcc ? (
          <div className="py-4 text-center"><div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div></div>
        ) : !accuracy ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No data yet</p>
            <p className="text-xs text-gray-600 mt-1">Complete orders to see AI accuracy</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: `${accuracy.within3MinAccuracy}%`, l: 'Within ±3 min', c: 'blue' },
              { v: `${accuracy.within5MinAccuracy}%`, l: 'Within ±5 min', c: 'green' },
              { v: `${accuracy.avgErrorMinutes}m`, l: 'Avg Error', c: 'purple' },
              { v: accuracy.totalPredictions, l: 'Predictions', c: 'gray' },
            ].map((s) => (
              <div key={s.l} className={`bg-${s.c}-500/10 border border-${s.c}-500/20 rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-black text-${s.c}-400`}>{s.v}</p>
                <p className="text-xs text-gray-500 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">📊 Predictions vs Reality</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">Logged after orders are collected</p>
        ) : (
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 text-[10px] font-semibold text-gray-500 px-2 uppercase tracking-wider">
              <span>Predicted</span><span>Actual</span><span>Error</span><span>OK?</span>
            </div>
            {logs.map((l, i) => (
              <div key={i} className="grid grid-cols-4 text-sm bg-white/[0.03] rounded-lg px-2 py-2">
                <span className="text-gray-300">{l.predicted}m</span>
                <span className="text-gray-300">{l.actual}m</span>
                <span className={l.absError <= 3 ? 'text-green-400' : 'text-red-400'}>
                  {l.error > 0 ? '+' : ''}{l.error}m
                </span>
                <span>{l.absError <= 3 ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demand */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">🤖 AI Demand Analysis</h2>
          <button onClick={runDemand} disabled={loadingDemand}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all hover:scale-[1.02]">
            {loadingDemand ? 'Analyzing...' : 'Run'}
          </button>
        </div>

        {demand?.analysis?.insights ? (
          <div className="space-y-4">
            {demand.analysis.peak_hours && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Peak Hours</p>
                <div className="flex flex-wrap gap-2">
                  {demand.analysis.peak_hours.map((ph, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      ph.intensity === 'extreme' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      ph.intensity === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      ph.intensity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>{ph.hour} — {ph.intensity}</span>
                  ))}
                </div>
              </div>
            )}
            {demand.analysis.insights && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Insights</p>
                {demand.analysis.insights.map((ins, i) => (
                  <p key={i} className="text-sm text-gray-300 flex items-start gap-2 mb-1.5">
                    <span className="text-blue-400">💡</span>{ins}
                  </p>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-600">Based on {demand.rawStats?.totalOrders || 0} orders (30 days)</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">Click "Run" for AI insights</p>
        )}
      </div>
    </div>
  );
}