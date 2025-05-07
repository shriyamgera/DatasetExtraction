import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Database, BarChart3, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
        Automating Dataset Extraction Using Natural Language Processing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your data files, process them with AI, and visualize insights with beautiful interactive charts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <Upload className="h-8 w-8 text-blue-500" />,
            title: 'Upload Data',
            description: 'Upload images, PDFs, or text files for AI processing',
            action: () => navigate('/upload'),
            color: 'bg-blue-50 border-blue-200'
          },
          {
            icon: <Database className="h-8 w-8 text-teal-500" />,
            title: 'Explore Datasets',
            description: 'Browse, download, and manage processed datasets',
            action: () => navigate('/datasets'),
            color: 'bg-teal-50 border-teal-200'
          },
          {
            icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
            title: 'Visualize Data',
            description: 'Create interactive charts to analyze your data',
            action: () => navigate('/visualization'),
            color: 'bg-purple-50 border-purple-200'
          }
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.color} border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer`}
            onClick={item.action}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <Zap className="h-16 w-16 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Powered by AI</h2>
            <p className="text-gray-700 mb-4">
              Our platform uses advanced AI to process your data files and extract structured information,
              making it easy to analyze and visualize complex datasets without any manual effort.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try it now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-500 p-4">
            <h3 className="text-white font-semibold text-lg">Supported Input Formats</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                'Images (JPG, PNG, JPEG)',
                'PDF Documents',
                'Text Files (TXT)'
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-purple-500 p-4">
            <h3 className="text-white font-semibold text-lg">Visualization Options</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                'Bar Charts',
                'Line Charts',
                'Pie Charts',
                'Scatter Plots',
                'Area Charts'
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-purple-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;