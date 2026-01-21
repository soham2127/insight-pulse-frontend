import { motion } from 'framer-motion';
import { Loader2, FileSearch, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProcessingState } from '@/types/sentiment';
import { cn } from '@/lib/utils';

interface ProcessingProps {
  state: ProcessingState;
}

const stages = [
  { id: 'parsing', icon: FileSearch, label: 'Parsing CSV data...' },
  { id: 'analyzing', icon: Brain, label: 'Analyzing sentiment patterns...' },
  { id: 'generating', icon: Sparkles, label: 'Generating insights...' },
  { id: 'complete', icon: CheckCircle2, label: 'Analysis complete!' },
] as const;

export const Processing = ({ state }: ProcessingProps) => {
  const currentIndex = stages.findIndex(s => s.id === state.stage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-8 sm:p-12 max-w-xl mx-auto text-center"
    >
      {/* Main Spinner */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-primary/20"
          style={{
            borderTopColor: 'hsl(var(--primary))',
            borderRightColor: 'hsl(var(--primary) / 0.5)',
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border-4 border-secondary/20"
          style={{
            borderBottomColor: 'hsl(var(--secondary))',
            borderLeftColor: 'hsl(var(--secondary) / 0.5)',
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {state.stage === 'complete' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-positive"
            >
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </motion.div>
          ) : (
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
          )}
        </div>
      </div>

      {/* Progress message */}
      <motion.h2
        key={state.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl font-semibold text-foreground mb-2"
      >
        {state.message}
      </motion.h2>

      {/* Progress bar */}
      <div className="w-full max-w-xs mx-auto mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${state.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{state.progress}% complete</p>
      </div>

      {/* Stage indicators */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all",
                isCompleted && "bg-positive/20 text-positive",
                isCurrent && "bg-primary/20 text-primary",
                !isCompleted && !isCurrent && "bg-muted/30 text-muted-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{stage.label.replace('...', '')}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
