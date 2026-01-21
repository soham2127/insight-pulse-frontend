import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileInfo } from '@/types/sentiment';
import { cn } from '@/lib/utils';

interface EnhancedFileUploadProps {
  onFileUpload: (file: File) => void;
  onAnalyze: () => void;
  fileInfo: FileInfo | null;
  onClearFile: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const EnhancedFileUpload = ({
  onFileUpload,
  onAnalyze,
  fileInfo,
  onClearFile,
}: EnhancedFileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return 'Only CSV files are supported. Please upload a valid CSV file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    onFileUpload(file);
  }, [onFileUpload]);

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
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-center justify-center">
        <Upload className="w-6 h-6 text-primary" />
        Upload Your Reviews
      </h3>
      <p className="text-muted-foreground text-center mb-6">
        Upload a CSV file containing customer reviews for sentiment analysis
      </p>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">Upload Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-destructive/60 hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone or File Info */}
      <AnimatePresence mode="wait">
        {!fileInfo ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "upload-zone min-h-[200px] flex flex-col items-center justify-center cursor-pointer group relative",
                isDragOver && "drag-over"
              )}
            >
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <motion.div
                animate={{ y: isDragOver ? -5 : 0 }}
                className="text-center"
              >
                <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-1">
                  Drag & drop your CSV file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse • Max 50MB
                </p>
                <Button variant="outline" className="pointer-events-none">
                  Browse Files
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* File Details */}
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-positive/10">
                  <FileText className="w-6 h-6 text-positive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{fileInfo.name}</p>
                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <span>{formatFileSize(fileInfo.size)}</span>
                    <span>•</span>
                    <span>{fileInfo.rows.toLocaleString()} reviews detected</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-positive" />
                  <button 
                    onClick={onClearFile}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            {fileInfo.preview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Preview (first 3 reviews)
                </p>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-2">
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
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-glow transition-all duration-300"
              >
                Run Sentiment Analysis
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
