export interface SentimentData {
  status?: string;
  message?: string;

  summary: {
    total_reviews: number;
    sentiment_summary: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };

  data: {
    positive_keywords: Array<{
      word: string;
      mean_tfidf: number;
      doc_frequency: number;
      doc_frequency_pct: number;
    }>;

    negative_keywords: Array<{
      word: string;
      mean_tfidf: number;
      doc_frequency: number;
      doc_frequency_pct: number;
    }>;

    aspect_sentiment: Array<{
      aspect: string;
      Positive: number;
      Neutral: number;
      Negative: number;
    }>;

    failure_components: Array<Record<string, any>>;

    top_products: Array<{
      ProductName: string;
      total_reviews?: number;
      Positive: number;
      Neutral: number;
      Negative: number;
      Total?: number;
      top_positive_keywords?: string;
      top_negative_keywords?: string;
    }>;
  };

  output_files?: {
    predictions?: string;
    positive_keywords?: string;
    negative_keywords?: string;
    aspect_sentiment_summary?: string;
    failure_components?: string;
    top_products?: string;
  };
}


export interface FileInfo {
  name: string;
  size: number;
  rows: number;
  preview: string[];
  file?: File;
}

export type ConnectionStatus = 'connected' | 'demo' | 'error';

export type AppStep = 'upload' | 'processing' | 'results';

export interface ProcessingState {
  stage: 'parsing' | 'analyzing' | 'generating' | 'complete';
  progress: number;
  message: string;
}

export interface ModelComparisonData {
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

export interface LLMAnalysisType {
  id: string;
  label: string;
  description: string;
}

export interface LLMAnalysisResult {
  type: string;
  content: string;
  error?: string;
}
