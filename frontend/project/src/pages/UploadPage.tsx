import React, { useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import { Database, FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadSuccess, setUploadSuccess } = useData();

  // Reset upload state when leaving the page
  useEffect(() => {
    return () => {
      setUploadSuccess(false);
    };
  }, [setUploadSuccess]);

  // Redirect to datasets page after successful upload with delay
  useEffect(() => {
    if (uploadSuccess) {
      const redirectTimer = setTimeout(() => {
        navigate('/datasets');
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [uploadSuccess, navigate]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10 pt-6">
        <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
          <FileUp className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Upload Your Data</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Upload images, PDF documents, or text files to process with our AI system. 
          The data will be extracted and converted into structured CSV datasets.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
        <FileUploader />
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 text-blue-500 mr-2" />
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'Upload',
              description: 'Upload your image, PDF or text file with data'
            },
            {
              step: '2',
              title: 'AI Processing',
              description: 'Our AI extracts and structures the data from your file'
            },
            {
              step: '3',
              title: 'Visualize',
              description: 'Access the structured data as CSV and visualize with charts'
            }
          ].map((item) => (
            <div key={item.step} className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                  {item.step}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;