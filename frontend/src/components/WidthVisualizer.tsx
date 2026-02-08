import React from 'react';
import type { Segment } from '../types';

interface WidthVisualizerProps {
    segments: Segment[];
}

export const WidthVisualizer: React.FC<WidthVisualizerProps> = ({ segments }) => {
    // SIMULATION CONSTANT: Let's assume the medical device button width is 200px
    const MAX_WIDTH_PX = 200;

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-medium">Compliance Review</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Visualizing text rendering against hardware constraints
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max Width</div>
                    <div className="text-white font-mono font-bold">{MAX_WIDTH_PX}px</div>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {segments.map((seg) => {
                    // The width_px now reflects the TARGET text if translated, or SOURCE if not.
                    const isOverflow = seg.width_px > MAX_WIDTH_PX;
                    const usagePercent = Math.min((seg.width_px / MAX_WIDTH_PX) * 100, 100);

                    return (
                        <div key={seg.id} className="p-4 hover:bg-slate-50 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center mb-1">
                                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-2">
                                            ID: {seg.id}
                                        </span>
                                        {/* Badge for Translation Status */}
                                        {seg.target_text && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                Translated
                                            </span>
                                        )}
                                    </div>

                                    {/* Text Display Logic */}
                                    {seg.target_text ? (
                                        <div>
                                            {/* Primary: The Translated Text */}
                                            <p className="text-base font-bold text-slate-900 leading-tight">
                                                {seg.target_text}
                                            </p>
                                            {/* Secondary: The Source Reference */}
                                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                <span className="opacity-75 mr-1">Original:</span>
                                                <span className="italic">"{seg.source_text}"</span>
                                            </p>
                                        </div>
                                    ) : (
                                        // Fallback: Just Source Text
                                        <p className="text-sm font-semibold text-slate-700 leading-tight">
                                            {seg.source_text}
                                        </p>
                                    )}
                                </div>

                                {/* Width Badge */}
                                <div className="text-right">
                                    <span className={`inline-block text-xs font-mono font-bold px-2 py-1 rounded border ${isOverflow
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                        {seg.width_px}px
                                    </span>
                                </div>
                            </div>

                            {/* Visual Bar mimicking the screen width */}
                            <div className="relative w-full h-8 bg-slate-100 rounded border border-slate-300 overflow-hidden mt-2 shadow-inner">
                                {/* The Safe Zone / Usage Bar */}
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${isOverflow ? 'bg-red-500' : 'bg-emerald-500'
                                        }`}
                                    style={{ width: `${usagePercent}%` }}
                                />

                                {/* The 100% Limit Line */}
                                <div className="absolute top-0 bottom-0 right-0 w-px bg-slate-400 z-10" />

                                {/* Ruler Ticks (Cosmetic) */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 border-t border-slate-200 flex justify-between px-px opacity-50">
                                    {[0, 25, 50, 75, 100].map(tick => (
                                        <div key={tick} className="h-full w-px bg-slate-400" />
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {isOverflow && (
                                <div className="mt-2 flex items-start space-x-2 text-red-600 animate-pulse">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-xs font-bold">
                                        CRITICAL OVERFLOW: Text exceeds display limit by {seg.width_px - MAX_WIDTH_PX}px.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};