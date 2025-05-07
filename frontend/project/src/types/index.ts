export interface Dataset {
  filename: string;
}

export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface UploadResponse {
  message: string;
  outputs?: Array<{
    filename: string;
    data: string;
  }>;
}

export interface DatasetListResponse {
  files: string[];
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  xKey: string;
  yKey: string;
  title: string;
}