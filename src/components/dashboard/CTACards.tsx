import { motion } from 'framer-motion';
import { BarChart3, Zap, Shield, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: BarChart3,
    title: 'Visual Insights',
    description: 'Transform raw reviews into interactive charts and actionable dashboards.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'AI-Powered Analysis',
    description: 'Leverage machine learning to detect sentiment patterns instantly.',
    color: 'secondary',
  },
  {
    icon: Shield,
    title: 'Identify Issues Fast',
    description: 'Spot common complaints and quality problems before they escalate.',
    color: 'warning',
  },
  {
    icon: TrendingUp,
    title: 'Track Improvements',
    description: 'Monitor sentiment trends over time to measure impact of changes.',
    color: 'positive',
  },
];

const colorClasses = {
  primary: 'bg-primary/10 text-primary group-hover:bg-primary/20',
  secondary: 'bg-secondary/10 text-secondary group-hover:bg-secondary/20',
  warning: 'bg-warning/10 text-warning group-hover:bg-warning/20',
  positive: 'bg-positive/10 text-positive group-hover:bg-positive/20',
};

export const CTACards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card p-5 group glow-hover cursor-default"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${colorClasses[benefit.color as keyof typeof colorClasses]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
