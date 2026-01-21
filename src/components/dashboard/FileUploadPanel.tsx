import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, X, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileInfo } from '@/types/sentiment';
import { cn } from '@/lib/utils';

interface FileUploadPanelProps {
  onFileUpload: (file: File) => void;
  onAnalyze: () => void;
  fileInfo: FileInfo | null;
  isAnalyzing: boolean;
  isComplete: boolean;
}

export const FileUploadPanel = ({
  onFileUpload,
  onAnalyze,
  fileInfo,
  isAnalyzing,
  isComplete,
}: FileUploadPanelProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        Upload Reviews
      </h3>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "upload-zone flex-1 min-h-[200px] flex flex-col items-center justify-center cursor-pointer group",
          isDragOver && "drag-over"
        )}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <motion.div
          animate={{ y: isDragOver ? -5 : 0 }}
          className="text-center"
        >
          <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground font-medium mb-1">
            Drag & drop your CSV file here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <Button variant="outline" size="sm" className="pointer-events-none">
            Browse Files
          </Button>
        </motion.div>
      </div>

      {/* File Info */}
      <AnimatePresence>
        {fileInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* File Details */}
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{fileInfo.name}</p>
                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <span>{formatFileSize(fileInfo.size)}</span>
                    <span>•</span>
                    <span>{fileInfo.rows.toLocaleString()} rows</span>
                  </div>
                </div>
                <Check className="w-5 h-5 text-positive" />
              </div>
            </div>

            {/* Preview */}
            {fileInfo.preview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Preview (first 3 reviews)
                </p>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {fileInfo.preview.map((review, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground line-clamp-2"
                    >
                      "{review}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onAnalyze}
                disabled={isAnalyzing || isComplete}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-glow transition-all duration-300 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Reviews...
                  </>
                ) : isComplete ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Analysis Complete
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Run Sentiment Analysis
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
