import { motion } from 'framer-motion';
import { BarChart3, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ConnectionStatus } from '@/types/sentiment';

interface HeaderProps {
  status: ConnectionStatus;
}

export const Header = ({ status }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient-primary">Text2Sentiment</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Review Intelligence Dashboard
            </h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              Upload raw customer reviews and transform them into actionable sentiment insights using AI.
              <Sparkles className="w-4 h-4 text-secondary" />
            </p>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatusBadge status={status} />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
