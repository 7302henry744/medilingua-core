import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { WidthVisualizer } from './components/WidthVisualizer';
import { AnalysisChat } from './components/AnalysisChat';
import { uploadFile, checkHealth, translateSegments } from './services/api';
import type { FileAnalysisResponse } from './types';

function App() {
  const [data, setData] = useState<FileAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemHealthy, setSystemHealthy] = useState(false);

  useEffect(() => {
    checkHealth().then(setSystemHealthy);
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await uploadFile(file);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!data) return;

    setIsTranslating(true);
    setError(null);

    try {
      // Call the Hybrid AI Engine
      const translatedSegments = await translateSegments(data.segments);

      // Update state with new target text and recalculated widths
      setData({
        ...data,
        segments: translatedSegments
      });
    } catch (err: any) {
      setError('Translation failed: ' + err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">MediLingua-Core</h1>
            <p className="text-xs text-blue-200">Regulated Localization Engine</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${systemHealthy ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs font-mono opacity-80">
              {systemHealthy ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Localization Safety Check</h2>
          <p className="text-gray-600">Upload standard medical .xliff files to validate UI constraints.</p>
        </div>

        <FileUpload onUpload={handleUpload} isProcessing={loading || isTranslating} />

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">Parsing XML & Calculating Pixel Widths...</p>
          </div>
        )}

        {data && (
          <div className="animate-fade-in pb-12">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Analysis Results</h3>
                <p className="text-sm text-gray-500">
                  {data.segments.length} segments extracted from {data.filename}
                </p>
              </div>

              {/* AI Translation Trigger */}
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`flex items-center space-x-2 px-4 py-2 rounded shadow-sm text-sm font-medium text-white transition-all
                   ${isTranslating
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Running Hybrid AI...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Auto-Translate</span>
                  </>
                )}
              </button>
            </div>

            <WidthVisualizer segments={data.segments} />

            {/* Context-Aware Assistant */}
            <AnalysisChat segments={data.segments} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;