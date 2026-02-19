const statusConfig = {
  confirmed: { bg: 'bg-ferro-black', text: 'text-white', label: 'CONFIRMED' },
  preparing: { bg: 'bg-ferro-orange', text: 'text-white', label: 'PREPARING', animate: true },
  ready: { bg: 'bg-green-600', text: 'text-white', label: 'READY_TO_COLLECT', animate: true },
  collected: { bg: 'bg-ferro-mint', text: 'text-ferro-black', label: 'ARCHIVED' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.confirmed;
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-[8px]' : 'px-4 py-1.5 text-[10px]';

  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-widest ${config.bg} ${config.text} ${sizeClasses}`}>
      {config.animate && <span className="w-1.5 h-1.5 bg-white animate-pulse" />}
      {config.label}
    </span>
  );
}