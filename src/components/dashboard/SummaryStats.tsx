import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MessageSquare, BarChart3 } from 'lucide-react';

interface SummaryStatsProps {
  positive?: number;
  neutral?: number;
  negative?: number;
}

export const SummaryStats = ({
  positive = 0,
  neutral = 0,
  negative = 0,
}: SummaryStatsProps) => {
  const total = positive + neutral + negative;

  const positiveRate =
    total > 0 ? ((positive / total) * 100).toFixed(1) : '0.0';

  const negativeRate =
    total > 0 ? ((negative / total) * 100).toFixed(1) : '0.0';

  // Simple derived score (safe placeholder)
  const avgScore =
    total > 0 ? ((positive * 1 + neutral * 0.5) / total * 10).toFixed(1) : '0.0';

  const stats = [
    {
      label: 'Total Reviews',
      value: total.toLocaleString(),
      icon: MessageSquare,
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
    },
    {
      label: 'Positive Rate',
      value: `${positiveRate}%`,
      icon: TrendingUp,
      bgClass: 'bg-positive/10',
      textClass: 'text-positive',
    },
    {
      label: 'Negative Rate',
      value: `${negativeRate}%`,
      icon: TrendingDown,
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
    },
    {
      label: 'Avg Sentiment Score',
      value: avgScore,
      icon: BarChart3,
      bgClass: 'bg-secondary/10',
      textClass: 'text-secondary',
      suffix: '/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="glass-card p-5 hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bgClass}`}>
              <stat.icon className={`w-5 h-5 ${stat.textClass}`} />
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
              {stat.suffix && (
                <span className="text-sm text-muted-foreground">
                  {stat.suffix}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
