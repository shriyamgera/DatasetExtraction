import { CSVData, DatasetListResponse, UploadResponse } from '../types';

const API_URL = 'http://127.0.0.1:5000';

export const fetchDatasets = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/list_datasets`);
    if (!response.ok) {
      throw new Error('Failed to fetch datasets');
    }
    const data: DatasetListResponse = await response.json();
    return data.files;
  } catch (error) {
    console.error('Error fetching datasets:', error);
    throw error;
  }
};

export const fetchCSVData = async (filename: string): Promise<CSVData> => {
  try {
    const response = await fetch(`${API_URL}/download_dataset/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset: ${filename}`);
    }
    const text = await response.text();
    
    // Parse CSV
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
    
    return { headers, rows };
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
};

export const uploadFile = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        // Extract the base64 data (remove the data:mime/type;base64, prefix)
        const base64Data = event.target.result.split(',')[1];
        
        const payload = {
          filename: file.name,
          data: base64Data
        };
        
        // Simulate progress for better UX
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          if (progress > 90) {
            clearInterval(progressInterval);
          }
          if (onProgress) {
            onProgress(progress);
          }
        }, 300);
        
        const response = await fetch(`${API_URL}/upload_base64`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        
        if (onProgress) {
          onProgress(100);
        }
        
        const data: UploadResponse = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read file as data URL to get base64
    reader.readAsDataURL(file);
  });
};

export const downloadDataset = (filename: string): void => {
  window.open(`${API_URL}/download_dataset/${filename}`, '_blank');
};