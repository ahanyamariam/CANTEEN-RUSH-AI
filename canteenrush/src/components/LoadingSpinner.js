import React from 'react';

export default function LoadingSpinner({ message = 'SYSTEM_BOOT' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ferro-offwhite">
      <div className="text-center">
        {/* Sharp, fast spinner in Ferro Orange */}
        <div className="w-10 h-10 border-2 border-ferro-black/10 border-t-ferro-orange animate-spin mx-auto" />
        <p className="mt-6 text-ferro-black font-black text-[10px] uppercase tracking-[0.3em]">{message}</p>
      </div>
    </div>
  );
}