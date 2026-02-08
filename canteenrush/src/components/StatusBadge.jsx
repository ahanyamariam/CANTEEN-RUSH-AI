const statusConfig = {
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Confirmed' },
  preparing: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Preparing', animate: true },
  ready: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Ready!', animate: true },
  collected: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400', label: 'Collected' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.confirmed;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} ${config.animate ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}