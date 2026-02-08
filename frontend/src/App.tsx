import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { WidthVisualizer } from './components/WidthVisualizer';
import { uploadFile, checkHealth } from './services/api';
import type { FileAnalysisResponse } from './types';

function App() {
  const [data, setData] = useState<FileAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
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

        <FileUpload onUpload={handleUpload} isProcessing={loading} />

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
          <div className="animate-fade-in">
            <WidthVisualizer segments={data.segments} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;