import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RawAspect {
  aspect: string;
  positive?: number;
  neutral?: number;
  negative?: number;
  Positive?: number;
  Neutral?: number;
  Negative?: number;
}

interface AspectsTabProps {
  aspects: RawAspect[];
}

/* Demo fallback */
const generateDemoAspects = () => [
  { aspect: 'Quality', positive: 120, negative: 25, neutral: 35 },
  { aspect: 'Price', positive: 85, negative: 45, neutral: 40 },
  { aspect: 'Delivery', positive: 90, negative: 55, neutral: 20 },
];

export const AspectsTab = ({ aspects }: AspectsTabProps) => {
  /* Normalize backend + demo data */
  const normalized = (aspects && aspects.length > 0 ? aspects : generateDemoAspects()).map(
    (item) => ({
      aspect: item.aspect,
      positive: item.positive ?? item.Positive ?? 0,
      neutral: item.neutral ?? item.Neutral ?? 0,
      negative: item.negative ?? item.Negative ?? 0,
    })
  );

  const getNetSentiment = (item: typeof normalized[0]) => {
    const total = item.positive + item.neutral + item.negative;
    if (total === 0) return '0.0';
    return (((item.positive - item.negative) / total) * 100).toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Aspect-Level Sentiment</h3>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={normalized} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="aspect" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill="hsl(var(--positive))" />
              <Bar dataKey="neutral" stackId="a" fill="hsl(var(--warning))" />
              <Bar dataKey="negative" stackId="a" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Aspect Summary</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Aspect</th>
                <th className="text-center p-3 text-positive">Positive</th>
                <th className="text-center p-3 text-warning">Neutral</th>
                <th className="text-center p-3 text-destructive">Negative</th>
                <th className="text-center p-3">Net</th>
              </tr>
            </thead>

            <tbody>
              {normalized.map((item, i) => {
                const net = Number(getNetSentiment(item));
                return (
                  <motion.tr
                    key={item.aspect}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-muted/20"
                  >
                    <td className="p-3 font-medium">{item.aspect}</td>
                    <td className="p-3 text-center text-positive">{item.positive}</td>
                    <td className="p-3 text-center text-warning">{item.neutral}</td>
                    <td className="p-3 text-center text-destructive">{item.negative}</td>
                    <td className="p-3 text-center">
                      <span className={net >= 0 ? 'text-positive' : 'text-destructive'}>
                        {net >= 0 ? '+' : ''}
                        {net}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
