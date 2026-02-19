import { Activity, Clock, Layers, Users, TrendingUp } from 'lucide-react';

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;
  const { estimatedMinutes, confidence, breakdown } = prediction;

  return (
    <div className="bg-white border border-ferro-black/10 p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-ferro-orange" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Prediction Protocol</span>
        </div>
        <span className="text-[10px] font-black border border-ferro-orange text-ferro-orange px-2 py-1">
          {confidence}% CONFIDENCE
        </span>
      </div>

      <div className="mb-10">
        <span className="text-[9px] font-bold text-ferro-black/40 uppercase tracking-widest block mb-2">Calculated_Wait_Time</span>
        <div className="text-8xl font-black tracking-tighter leading-none">
          {estimatedMinutes}<span className="text-xl text-ferro-black/20 ml-2">MIN</span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-ferro-black/10 border-t border-ferro-black/10 pt-8">
        <div className="pr-4">
          <p className="text-[9px] font-bold text-ferro-black/40 uppercase mb-1">Raw_Prep</p>
          <p className="text-xl font-black">{breakdown.prepTime}m</p>
        </div>
        <div className="px-4">
          <p className="text-[9px] font-bold text-ferro-black/40 uppercase mb-1">Queue_Load</p>
          <p className="text-xl font-black">{breakdown.queueDelay}m</p>
        </div>
        <div className="pl-4">
          <p className="text-[9px] font-bold text-ferro-black/40 uppercase mb-1">Volatility</p>
          <p className="text-xl font-black text-ferro-orange">{breakdown.rushMultiplier}x</p>
        </div>
      </div>
    </div>
  );
}