import React, { useState } from 'react';
import { askAssistant } from '../services/api';
import type { Segment } from '../types';

interface AnalysisChatProps {
    segments: Segment[];
}

export const AnalysisChat: React.FC<AnalysisChatProps> = ({ segments }) => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setResponse(null);

        try {
            const reply = await askAssistant(question, segments);
            setResponse(reply);
        } catch (err) {
            setResponse("Sorry, I couldn't reach the analysis engine.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 bg-white border border-indigo-100 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center space-x-2">
                <span className="text-xl">🤖</span>
                <div>
                    <h3 className="text-indigo-900 font-semibold">Compliance Assistant</h3>
                    <p className="text-xs text-indigo-600">Ask about safety violations, translations, or layout.</p>
                </div>
            </div>

            <div className="p-6">
                {response && (
                    <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{response}</p>
                    </div>
                )}

                <form onSubmit={handleAsk} className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="E.g., 'Why is segment 2 red?' or 'Are there any glossary terms?'"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-sm font-medium text-white transition-colors
              ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Analyzing...' : 'Ask AI'}
                    </button>
                </form>
            </div>
        </div>
    );
};