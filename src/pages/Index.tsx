import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/dashboard/Header';
import { Footer } from '@/components/dashboard/Footer';
import { StepIndicator } from '@/components/dashboard/StepIndicator';
import { CTACards } from '@/components/dashboard/CTACards';
import { EnhancedFileUpload } from '@/components/dashboard/EnhancedFileUpload';
import { Processing } from '@/components/dashboard/Processing';
import { TabbedDashboard } from '@/components/dashboard/TabbedDashboard';
import { ModelComparison } from '@/components/dashboard/ModelComparison';
import { LLMAnalyzer } from '@/components/dashboard/LLMAnalyzer';
import { SentimentData, FileInfo, ConnectionStatus, AppStep, ProcessingState } from '@/types/sentiment';
import { analyzeFile, parseCSV, formatCSVForLLM } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, GitCompare, Brain } from 'lucide-react';

// Demo data for testing
const DEMO_DATA: SentimentData = {
  positive: 120,
  neutral: 45,
  negative: 30,
  common_issues: [
    { label: "Late Delivery", count: 80 },
    { label: "Bad Packaging", count: 55 },
    { label: "Battery Issues", count: 40 },
    { label: "Poor Support", count: 35 },
    { label: "Wrong Item", count: 28 },
  ],
  praised_features: [
    { label: "Battery Life", count: 70 },
    { label: "Camera", count: 60 },
    { label: "Build Quality", count: 50 },
    { label: "Value for Money", count: 45 },
    { label: "Fast Shipping", count: 38 },
  ],
  samples: {
    positive: [
      "Amazing product! The battery life exceeds expectations.",
      "Best purchase I've made this year. Highly recommended!",
      "Great value for money, very satisfied with the quality."
    ],
    neutral: [
      "Okay product, nothing special but does the job.",
      "Average experience, met basic expectations.",
      "Decent quality for the price point."
    ],
    negative: [
      "Product stopped working after a week. Very disappointed.",
      "Terrible customer service, took forever to get a response.",
      "Poor build quality, not worth the price at all."
    ]
  },
  keywords: {
    positive: [
      { word: 'excellent', count: 156 },
      { word: 'amazing', count: 134 },
      { word: 'great', count: 128 },
      { word: 'love', count: 112 },
    ],
    negative: [
      { word: 'broken', count: 89 },
      { word: 'terrible', count: 76 },
      { word: 'slow', count: 67 },
      { word: 'disappointed', count: 58 },
    ],
  },
  aspects: [
    { aspect: 'Quality', positive: 120, negative: 25, neutral: 35 },
    { aspect: 'Price', positive: 85, negative: 45, neutral: 40 },
    { aspect: 'Delivery', positive: 90, negative: 55, neutral: 20 },
    { aspect: 'Packaging', positive: 75, negative: 30, neutral: 25 },
  ],
  products: [
    { name: 'Wireless Earbuds Pro', positive: 245, negative: 32, neutral: 48, score: 85 },
    { name: 'Smart Watch Ultra', positive: 189, negative: 45, neutral: 56, score: 72 },
    { name: 'USB-C Charger 65W', positive: 156, negative: 12, neutral: 28, score: 89 },
  ],
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('demo');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'parsing',
    progress: 0,
    message: 'Preparing analysis...',
  });
  const [csvContent, setCsvContent] = useState<string>('');
  const [activeResultsTab, setActiveResultsTab] = useState('dashboard');

  const handleFileUpload = useCallback(async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const { headers, rows } = parseCSV(text);
    
    // Get reviews from first text column
    const reviews = rows.slice(0, 3).map(row => row[0] || '').filter(Boolean);

    setFileInfo({
      name: file.name,
      size: file.size,
      rows: lines.length - 1,
      preview: reviews,
      file,
    });

    setCsvContent(formatCSVForLLM(headers, rows));
  }, []);

  const handleClearFile = useCallback(() => {
    setFileInfo(null);
    setCsvContent('');
  }, []);

  const simulateProcessing = useCallback(async () => {
    const stages: Array<{ stage: ProcessingState['stage']; message: string; duration: number }> = [
      { stage: 'parsing', message: 'Parsing CSV data...', duration: 800 },
      { stage: 'analyzing', message: 'Analyzing sentiment patterns...', duration: 1200 },
      { stage: 'generating', message: 'Generating insights...', duration: 1000 },
      { stage: 'complete', message: 'Analysis complete!', duration: 500 },
    ];

    let progress = 0;
    for (const { stage, message, duration } of stages) {
      setProcessingState({ stage, progress, message });
      await new Promise(resolve => setTimeout(resolve, duration));
      progress += 25;
    }
    setProcessingState({ stage: 'complete', progress: 100, message: 'Analysis complete!' });
  }, []);

  const handleAnalyze = useCallback(async () => {
  if (!fileInfo?.file) return;

  setCurrentStep('processing');

  try {
    // Start animation
    const processingPromise = simulateProcessing();

    try {
      console.log("Calling backend...");
      const data = await analyzeFile(fileInfo.file);
      console.log("Backend response:", data);

      setSentimentData(data);
      setConnectionStatus('connected');
    } catch (error) {
      console.error("Backend error:", error);
      alert("Backend call failed — check console.");
      setConnectionStatus('error');
      setCurrentStep('upload');
      return;
    }

    await processingPromise;
    setCurrentStep('results');
  } catch (error) {
    console.error('Analysis error:', error);
    setConnectionStatus('error');
    setCurrentStep('upload');
  }
}, [fileInfo, simulateProcessing]);


  const handleLoadDemo = useCallback(() => {
    setSentimentData(DEMO_DATA);
    setConnectionStatus('demo');
    setCurrentStep('results');
  }, []);

  const handleExport = useCallback(() => {
    if (!sentimentData) return;
    
    const report = JSON.stringify(sentimentData, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [sentimentData]);

  const handleRestart = useCallback(() => {
    setCurrentStep('upload');
    setFileInfo(null);
    setSentimentData(null);
    setCsvContent('');
    setProcessingState({ stage: 'parsing', progress: 0, message: 'Preparing analysis...' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header status={connectionStatus} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* CTA Cards */}
              <CTACards />

              {/* File Upload */}
              <EnhancedFileUpload
                onFileUpload={handleFileUpload}
                onAnalyze={handleAnalyze}
                fileInfo={fileInfo}
                onClearFile={handleClearFile}
              />

              {/* Demo Data Option */}
              {!fileInfo && (
                <div className="text-center">
                  <button
                    onClick={handleLoadDemo}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Or try with demo data →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Processing state={processingState} />
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && sentimentData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Results Navigation */}
              <Tabs value={activeResultsTab} onValueChange={setActiveResultsTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="dashboard" className="gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="gap-1.5">
                      <GitCompare className="w-4 h-4" />
                      Model Comparison
                    </TabsTrigger>
                    <TabsTrigger value="llm" className="gap-1.5">
                      <Brain className="w-4 h-4" />
                      LLM Insights
                    </TabsTrigger>
                  </TabsList>

                  <button
                    onClick={handleRestart}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    ← Analyze another file
                  </button>
                </div>

                <TabsContent value="dashboard">
                  <TabbedDashboard data={sentimentData} onExport={handleExport} />
                </TabsContent>

                <TabsContent value="comparison">
                  <ModelComparison />
                </TabsContent>

                <TabsContent value="llm">
                  <LLMAnalyzer csvContent={csvContent} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
