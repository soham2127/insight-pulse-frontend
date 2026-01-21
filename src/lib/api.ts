// API service for backend communication

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";


export interface AnalyzeResponse {
  positive: number;
  neutral: number;
  negative: number;
  common_issues: Array<{ label: string; count: number }>;
  praised_features: Array<{ label: string; count: number }>;
  samples: {
    positive: string[];
    neutral: string[];
    negative: string[];
  };
  keywords?: {
    positive: Array<{ word: string; count: number }>;
    negative: Array<{ word: string; count: number }>;
  };
  aspects?: Array<{ aspect: string; positive: number; negative: number; neutral: number }>;
  products?: Array<{ 
    name: string; 
    positive: number; 
    negative: number; 
    neutral: number;
    score: number;
  }>;
}

export async function analyzeFile(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Analysis failed');
  }

  return response.json();
}

export interface CompareResponse {
  ml: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
  vader: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
}

export async function fetchModelComparison(): Promise<CompareResponse> {
  const response = await fetch(`${BACKEND_URL}/compare`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch model comparison');
  }

  return response.json();
}

export interface LLMAnalyzeRequest {
  model: string;
  analysisTypes: string[];
  csvContent?: string;
}

export interface LLMAnalyzeResponse {
  results: Array<{
    type: string;
    content: string;
    error?: string;
  }>;
}

export async function analyzeLLM(request: LLMAnalyzeRequest): Promise<LLMAnalyzeResponse> {
  const response = await fetch(`${BACKEND_URL}/analyze-llm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('LLM analysis failed');
  }

  return response.json();
}

// CSV parsing helper
export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return { headers, rows };
}

export function formatCSVForLLM(headers: string[], rows: string[][], maxRows = 100): string {
  const limitedRows = rows.slice(0, maxRows);
  const headerLine = headers.join(',');
  const dataLines = limitedRows.map(row => row.join(','));
  return [headerLine, ...dataLines].join('\n');
}
