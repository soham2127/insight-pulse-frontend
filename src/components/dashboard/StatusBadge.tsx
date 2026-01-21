import { motion } from 'framer-motion';
import { ConnectionStatus } from '@/types/sentiment';

interface StatusBadgeProps {
  status: ConnectionStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isConnected = status === 'connected';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border"
    >
      <motion.span
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-positive shadow-[0_0_8px_hsl(var(--positive))]' : 'bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]'
        }`}
      />
      <span className="text-xs font-medium text-muted-foreground">
        {isConnected ? 'Connected to server' : 'Using demo data'}
      </span>
    </motion.div>
  );
};
