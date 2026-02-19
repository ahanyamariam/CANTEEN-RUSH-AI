import { Check, Cpu, Package, Archive } from 'lucide-react';

const steps = [
  { key: 'confirmed', label: 'INIT', icon: Check },
  { key: 'preparing', label: 'PREP', icon: Cpu },
  { key: 'ready', label: 'READY', icon: Package },
  { key: 'collected', label: 'ARCHV', icon: Archive },
];

const statusIndex = { confirmed: 0, preparing: 1, ready: 2, collected: 3 };

export default function TimelineTracker({ status }) {
  const currentIndex = statusIndex[status] ?? 0;

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {steps.map((step, i) => {
        const isActive = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex flex-col">
            <div className={`h-1.5 mb-3 transition-colors duration-500 ${
              isActive ? (isCurrent ? 'bg-ferro-orange animate-pulse' : 'bg-ferro-black') : 'bg-ferro-black/10'
            }`} />
            <div className="flex justify-between items-center">
              <span className={`text-[9px] font-black tracking-widest ${isActive ? 'text-ferro-black' : 'text-ferro-black/20'}`}>
                0{i + 1} / {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}