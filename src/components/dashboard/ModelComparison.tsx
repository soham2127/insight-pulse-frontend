import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModelComparisonData } from '@/types/sentiment';
import { fetchModelComparison } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';

// Demo data
const DEMO_COMPARISON: ModelComparisonData = {
  ml: { accuracy: 0.89, precision: 0.87, recall: 0.85, f1: 0.86 },
  vader: { accuracy: 0.72, precision: 0.68, recall: 0.75, f1: 0.71 },
};

export const ModelComparison = () => {
  const [data, setData] = useState<ModelComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchModelComparison();
      setData(result);
    } catch (err) {
      console.log('Using demo comparison data');
      setData(DEMO_COMPARISON);
      setError('Using demo data - backend not available');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComparison();
  }, [loadComparison]);

  if (!data) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading model comparison...</p>
      </div>
    );
  }

  const chartData = [
    { metric: 'Accuracy', ML: data.ml.accuracy * 100, VADER: data.vader.accuracy * 100 },
    { metric: 'Precision', ML: data.ml.precision * 100, VADER: data.vader.precision * 100 },
    { metric: 'Recall', ML: data.ml.recall * 100, VADER: data.vader.recall * 100 },
    { metric: 'F1 Score', ML: data.ml.f1 * 100, VADER: data.vader.f1 * 100 },
  ];

  const lineData = chartData.map((item, index) => ({
    ...item,
    index,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitCompare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Model Comparison</h2>
            <p className="text-sm text-muted-foreground">ML vs VADER Performance</p>
          </div>
        </div>
        <Button 
          onClick={loadComparison} 
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2 text-warning text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Metrics Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`]}
                />
                <Legend />
                <Bar dataKey="ML" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="VADER" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ML" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="VADER" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Model</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Accuracy</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Precision</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Recall</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">F1 Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-primary">Machine Learning</td>
                <td className="py-3 px-4 text-center">{(data.ml.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.ml.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.ml.recall * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.ml.f1 * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-secondary">VADER</td>
                <td className="py-3 px-4 text-center">{(data.vader.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.vader.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.vader.recall * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(data.vader.f1 * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
