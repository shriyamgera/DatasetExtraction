import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { uploadFile } from '../services/api';
import { FileUp, Upload, Check, X, AlertCircle, FileText } from 'lucide-react';

const FileUploader: React.FC = () => {
  const { 
    uploadProgress, 
    setUploadProgress, 
    uploadSuccess, 
    setUploadSuccess, 
    setError 
  } = useData();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Array<{ filename: string }>>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadError(null);
    setGeneratedFiles([]);
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadError(null);
      setError(null);
      
      const response = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadSuccess(true);
      
      if (response.outputs) {
        setGeneratedFiles(response.outputs.map(output => ({ filename: output.filename })));
      }
      
      setTimeout(() => {
        setFile(null);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'}
          ${file ? 'border-solid border-teal-500' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".jpg,.jpeg,.png,.pdf,.txt"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`mb-4 transition-all duration-300 ${file ? 'opacity-100' : 'opacity-80'}`}>
            {file ? (
              <div className="p-3 bg-teal-100 rounded-full">
                <Check className="h-10 w-10 text-teal-500" />
              </div>
            ) : (
              <div className="p-3 bg-blue-100 rounded-full">
                <FileUp className="h-10 w-10 text-blue-500" />
              </div>
            )}
          </div>
          
          {!file ? (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Drag & drop your file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse your files
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: .jpg, .jpeg, .png, .pdf, .txt
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                File selected
              </h3>
              <p className="text-gray-600 mb-3 max-w-xs truncate">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{uploadError}</p>
        </div>
      )}

      {file && !uploadSuccess && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center
              ${isUploading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'} 
              text-white
            `}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </>
            )}
          </button>
          
          {isUploading && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {uploadProgress < 100 ? 'Uploading file...' : 'Processing file...'}
              </p>
            </div>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center mb-4">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Upload successful!</p>
              <p className="text-green-600 text-sm">Your file has been processed</p>
            </div>
          </div>
          
          {generatedFiles.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Generated Files:</h4>
              <div className="space-y-2">
                {generatedFiles.map((file, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    {file.filename}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;