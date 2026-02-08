import { Check, Clock, Flame, Package, CircleCheckBig } from 'lucide-react';

const steps = [
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'preparing', label: 'Preparing', icon: Flame },
  { key: 'ready', label: 'Ready', icon: Package },
  { key: 'collected', label: 'Collected', icon: CircleCheckBig },
];

const statusIndex = { confirmed: 0, preparing: 1, ready: 2, collected: 3 };

export default function TimelineTracker({ status }) {
  const currentIndex = statusIndex[status] ?? 0;

  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary/10 text-primary ring-2 ring-primary ring-offset-2'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < currentIndex ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}