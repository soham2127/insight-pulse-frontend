import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart3, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppStep } from '@/types/sentiment';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'processing', label: 'Processing', icon: Cpu },
  { id: 'results', label: 'Results', icon: BarChart3 },
] as const;

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all duration-300",
                isCompleted && "bg-positive/20 text-positive",
                isCurrent && "bg-primary/20 text-primary shadow-glow",
                !isCompleted && !isCurrent && "bg-muted/30 text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">{step.label}</span>
            </motion.div>

            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-colors duration-300",
                index < currentIndex ? "bg-positive" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};
