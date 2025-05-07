import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Dataset, CSVData } from '../types';

interface DataContextType {
  datasets: Dataset[];
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  currentCSVData: CSVData | null;
  setCurrentCSVData: React.Dispatch<React.SetStateAction<CSVData | null>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  uploadSuccess: boolean;
  setUploadSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCSVData, setCurrentCSVData] = useState<CSVData | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  return (
    <DataContext.Provider
      value={{
        datasets,
        setDatasets,
        loading,
        setLoading,
        error,
        setError,
        currentCSVData,
        setCurrentCSVData,
        uploadProgress, 
        setUploadProgress,
        uploadSuccess,
        setUploadSuccess
      }}
    >
      {children}
    </DataContext.Provider>
  );
};