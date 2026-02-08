import React from 'react';
import type { Segment } from '../types';

interface WidthVisualizerProps {
    segments: Segment[];
}

export const WidthVisualizer: React.FC<WidthVisualizerProps> = ({ segments }) => {
    // SIMULATION CONSTANT: Let's assume the medical device button width is 200px
    const MAX_WIDTH_PX = 200;

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-medium">Compliance Review: {segments.length} Segments</h3>
                <span className="text-xs text-gray-400">Device Limit: {MAX_WIDTH_PX}px</span>
            </div>

            <div className="divide-y divide-gray-200">
                {segments.map((seg) => {
                    // Check if width exceeds limit (Simulating Backend Logic reflection)
                    const isOverflow = seg.width_px > MAX_WIDTH_PX;
                    const usagePercent = Math.min((seg.width_px / MAX_WIDTH_PX) * 100, 100);

                    return (
                        <div key={seg.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded mr-2">
                                        ID: {seg.id}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {seg.source_text}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${isOverflow ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {seg.width_px}px
                                    </span>
                                </div>
                            </div>

                            {/* Visual Bar mimicking the screen width */}
                            <div className="relative w-full h-6 bg-gray-200 rounded-sm overflow-hidden mt-2 border border-gray-300">
                                {/* The Safe Zone */}
                                <div
                                    className={`h-full ${isOverflow ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${usagePercent}%` }}
                                />

                                {/* The Limit Line */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30 right-0 z-10" />
                            </div>

                            {isOverflow && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    ⚠️ Critical Safety Alert: Text exceeds display width by {seg.width_px - MAX_WIDTH_PX}px.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};