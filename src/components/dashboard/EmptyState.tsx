import { motion } from 'framer-motion';
import { BarChart3, FileSpreadsheet, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onLoadDemo?: () => void;
}

export const EmptyState = ({ onLoadDemo }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
          <BarChart3 className="w-16 h-16 text-primary" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-gradient-primary">
        Ready to Analyze
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Upload your CSV file containing customer reviews to unlock powerful sentiment insights and discover what your customers really think.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-positive/10 text-positive text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Analysis</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm">
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV Support</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Visual Charts</span>
        </div>
      </div>

      {onLoadDemo && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onLoadDemo}
            variant="outline"
            className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
          >
            <Play className="w-4 h-4" />
            Try with Demo Data
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
