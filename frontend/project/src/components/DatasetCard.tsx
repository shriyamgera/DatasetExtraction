import React from 'react';
import { Database, Download, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadDataset } from '../services/api';

interface DatasetCardProps {
  filename: string;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ filename }) => {
  const navigate = useNavigate();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadDataset(filename);
  };

  const handleNavigateToViz = () => {
    navigate(`/visualization/${filename}`);
  };

  // Extract file extension and category
  const fileExtension = filename.split('.').pop() || '';
  const nameWithoutExtension = filename.replace(`.${fileExtension}`, '');
  
  // Generate a pastel color based on the filename
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel colors (lighter)
    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`;
  };

  const bgColor = getColor(nameWithoutExtension);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleNavigateToViz}
    >
      <div 
        className="h-32 flex items-center justify-center p-6" 
        style={{ backgroundColor: bgColor }}
      >
        <Database className="h-14 w-14 text-gray-700 opacity-80" />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">
          {nameWithoutExtension}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
            {fileExtension.toUpperCase()}
          </span>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleDownload}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Download dataset"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
            
            <button 
              onClick={handleNavigateToViz}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Visualize dataset"
            >
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;