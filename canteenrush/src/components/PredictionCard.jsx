import { Brain, Clock, TrendingUp, Users, Zap } from 'lucide-react';

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const { estimatedMinutes, confidence, breakdown, window: timeWindow } = prediction;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg">
          <Brain size={18} className="text-primary" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">AI Prediction Engine</h3>
        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          {confidence}% confidence
        </span>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-primary">
          ~{estimatedMinutes} <span className="text-lg font-medium text-gray-500">min</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">estimated wait time</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white rounded-xl p-2.5 border border-gray-100">
          <Clock size={14} className="text-blue-500 mx-auto mb-1" />
          <div className="text-sm font-semibold text-gray-900">{breakdown.prepTime}m</div>
          <div className="text-[10px] text-gray-500">Prep Time</div>
        </div>
        <div className="bg-white rounded-xl p-2.5 border border-gray-100">
          <Users size={14} className="text-amber-500 mx-auto mb-1" />
          <div className="text-sm font-semibold text-gray-900">{breakdown.queueDelay}m</div>
          <div className="text-[10px] text-gray-500">Queue Delay</div>
        </div>
        <div className="bg-white rounded-xl p-2.5 border border-gray-100">
          <TrendingUp size={14} className="text-red-500 mx-auto mb-1" />
          <div className="text-sm font-semibold text-gray-900">{breakdown.rushMultiplier}x</div>
          <div className="text-[10px] text-gray-500">{breakdown.rushLabel}</div>
        </div>
      </div>

      {timeWindow && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Zap size={12} className="text-amber-500" />
          <span>Pickup window: ±{timeWindow.margin} min</span>
        </div>
      )}
    </div>
  );
}