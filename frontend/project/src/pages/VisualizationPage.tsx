import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { fetchCSVData, fetchDatasets } from '../services/api';
import ChartContainer from '../components/ChartContainer';
import DataGrid from '../components/DataGrid';
import { BarChart3, Database, AlertCircle, Table } from 'lucide-react';

const VisualizationPage: React.FC = () => {
  const { filename } = useParams<{ filename?: string }>();
  const navigate = useNavigate();
  const { 
    datasets, 
    setDatasets, 
    currentCSVData, 
    setCurrentCSVData, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'chart' | 'data'>('chart');
  const [loadingDataset, setLoadingDataset] = useState(false);

  // Fetch available datasets if needed
  useEffect(() => {
    const loadDatasets = async () => {
      if (datasets.length === 0) {
        try {
          setLoading(true);
          const data = await fetchDatasets();
          setDatasets(data.map(name => ({ filename: name })));
          
          // If no filename is provided but we have datasets, redirect to the first one
          if (!filename && data.length > 0) {
            navigate(`/visualization/${data[0]}`);
          }
        } catch (error) {
          console.error('Error loading datasets:', error);
          setError(error instanceof Error ? error.message : 'Failed to load datasets');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadDatasets();
  }, [datasets.length, filename, navigate, setDatasets, setError, setLoading]);

  // Load the selected dataset
  useEffect(() => {
    const loadCSVData = async () => {
      if (!filename) return;
      
      try {
        setLoadingDataset(true);
        setError(null);
        const data = await fetchCSVData(filename);
        setCurrentCSVData(data);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        setError(error instanceof Error ? error.message : `Failed to load dataset: ${filename}`);
      } finally {
        setLoadingDataset(false);
      }
    };
    
    loadCSVData();
  }, [filename, setCurrentCSVData, setError]);

  // Handle dataset change
  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/visualization/${e.target.value}`);
  };

  if (loading && datasets.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
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
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="min-h-[400px] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <Database className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Datasets Available</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Upload a file to process it with our AI system and generate datasets for visualization.
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
            Data Visualization
          </h1>
          <p className="text-gray-600">
            Create interactive charts to analyze your dataset
          </p>
        </div>
        
        <div className="w-full sm:w-64">
          <select
            value={filename || ''}
            onChange={handleDatasetChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="" disabled>Select a dataset</option>
            {datasets.map((dataset) => (
              <option key={dataset.filename} value={dataset.filename}>
                {dataset.filename}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {filename && (
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'chart'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('chart')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Visualization
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'data'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('data')}
                >
                  <Table className="h-4 w-4 mr-2" />
                  Raw Data
                </button>
              </div>
            </div>

            {loadingDataset ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="mt-3 text-gray-600">Loading dataset...</p>
                </div>
              </div>
            ) : currentCSVData ? (
              <div className="p-4">
                {activeTab === 'chart' ? (
                  <ChartContainer data={currentCSVData} />
                ) : (
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
                    <DataGrid data={currentCSVData} />
                  </div>
                )}
              </div>
            ) : (
              <div className="min-h-[200px] flex items-center justify-center p-8">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationPage;