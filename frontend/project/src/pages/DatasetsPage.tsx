import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { fetchDatasets } from '../services/api';
import DatasetCard from '../components/DatasetCard';
import { Database, RefreshCw, AlertCircle } from 'lucide-react';

const DatasetsPage: React.FC = () => {
  const { datasets, setDatasets, loading, setLoading, error, setError } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDatasets();
      setDatasets(data.map(filename => ({ filename })));
    } catch (error) {
      console.error('Error loading datasets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDatasets();
    setTimeout(() => setRefreshing(false), 500); // Show spinner for at least 500ms
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Database className="h-8 w-8 text-blue-500 mr-3" />
            Available Datasets
          </h1>
          <p className="text-gray-600">
            Browse and visualize your processed datasets
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error loading datasets</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading && !refreshing ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-3 text-gray-600">Loading datasets...</p>
          </div>
        </div>
      ) : datasets.length === 0 ? (
        <div className="min-h-[300px] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Database className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Datasets Found</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Upload a file to process it with our AI system and generate datasets.
            </p>
            <a
              href="/upload"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.filename}
              filename={dataset.filename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;