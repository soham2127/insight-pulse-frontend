import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LLMAnalysisType, LLMAnalysisResult } from '@/types/sentiment';
import { analyzeLLM } from '@/lib/api';

const ANALYSIS_TYPES: LLMAnalysisType[] = [
  { id: 'aspect_summary', label: 'Aspect Summary', description: 'Summarize sentiment by product aspects' },
  { id: 'keywords', label: 'Keywords Extraction', description: 'Extract key positive and negative keywords' },
  { id: 'product_breakdown', label: 'Product Breakdown', description: 'Analyze sentiment by product' },
  { id: 'failures', label: 'Failure Analysis', description: 'Identify common failure points and issues' },
  { id: 'examples', label: 'Notable Examples', description: 'Find standout positive and negative reviews' },
];

const MODELS = [
  { id: 'gpt-4', label: 'GPT-4' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { id: 'claude-3', label: 'Claude 3' },
];

interface LLMAnalyzerProps {
  csvContent?: string;
}

export const LLMAnalyzer = ({ csvContent }: LLMAnalyzerProps) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['aspect_summary']);
  const [results, setResults] = useState<LLMAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const runAnalysis = useCallback(async () => {
    if (selectedTypes.length === 0) {
      setError('Please select at least one analysis type');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await analyzeLLM({
        model: selectedModel,
        analysisTypes: selectedTypes,
        csvContent,
      });
      setResults(response.results);
    } catch (err) {
      // Use demo results
      setResults(selectedTypes.map(type => ({
        type,
        content: getDemoContent(type),
      })));
      setError('Using demo results - backend not available');
    } finally {
      setLoading(false);
    }
  }, [selectedModel, selectedTypes, csvContent]);

  const getDemoContent = (type: string): string => {
    const demos: Record<string, string> = {
      aspect_summary: `## Aspect Sentiment Summary\n\n**Quality**: Overall positive (78% favorable). Customers praise build quality and materials.\n\n**Delivery**: Mixed sentiment (52% positive). Speed is praised but packaging issues noted.\n\n**Price**: Mostly positive (65% favorable). Good value perception, some complaints about premium pricing.`,
      keywords: `## Keyword Analysis\n\n**Positive Keywords**: excellent, great, amazing, fast, reliable, recommend, love, perfect\n\n**Negative Keywords**: broken, slow, disappointing, refund, damaged, poor, waste`,
      product_breakdown: `## Product Sentiment\n\n**Wireless Earbuds Pro**: Highest rated (4.5/5). Battery life praised.\n\n**Smart Watch Ultra**: Good ratings (4.0/5). App connectivity issues reported.\n\n**USB-C Charger**: Mixed reviews (3.5/5). Fast charging works, durability concerns.`,
      failures: `## Common Failure Points\n\n1. **Packaging Damage** (23% of complaints): Items arriving damaged\n2. **Battery Issues** (18%): Shorter life than advertised\n3. **Connectivity** (15%): Bluetooth pairing problems\n4. **Build Quality** (12%): Parts breaking within weeks`,
      examples: `## Notable Reviews\n\n**⭐ Best Review**: "This product exceeded all my expectations! The battery lasts 3 days and the sound quality is exceptional."\n\n**👎 Critical Review**: "Completely stopped working after 2 weeks. Customer support was unhelpful and I'm still waiting for my refund."`,
    };
    return demos[type] || 'Analysis complete.';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Brain className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">LLM Insights</h2>
          <p className="text-sm text-muted-foreground">AI-powered deep analysis</p>
        </div>
      </div>

      {/* Configuration */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Select Model
            </label>
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-foreground hover:bg-muted/70 transition-colors"
              >
                <span>{MODELS.find(m => m.id === selectedModel)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    {MODELS.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors ${
                          selectedModel === model.id ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`}
                      >
                        {model.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Analysis Types */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Analysis Types
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {ANALYSIS_TYPES.map(type => (
                <label
                  key={type.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => toggleType(type.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{type.label}</span>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Run Button */}
        <Button
          onClick={runAnalysis}
          disabled={loading || selectedTypes.length === 0}
          className="w-full mt-6 h-11 bg-gradient-to-r from-secondary to-primary gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run LLM Analysis
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2 text-warning text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {results.map((result, index) => {
              const typeInfo = ANALYSIS_TYPES.find(t => t.id === result.type);
              return (
                <motion.div
                  key={result.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    {typeInfo?.label || result.type}
                  </h3>
                  {result.error ? (
                    <p className="text-destructive text-sm">{result.error}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {result.content}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
