import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    // Health check to verify Backend connection
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => setStatus(`Connected: ${data.status} (v${data.version})`))
      .catch(err => setStatus(`Error connecting to backend: ${err}`));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">MediLingua-Core</h1>
        <p className="text-gray-600 mb-6">Regulated Localization Platform</p>

        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <p className="text-sm font-semibold text-gray-500 uppercase">System Status</p>
          <div className="mt-1 font-mono text-sm text-blue-700">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;