import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { AlertTriangle, ThumbsUp } from 'lucide-react';

/* Accept optional backend data */
interface InsightItem {
  label: string;
  count: number;
}

interface InsightsPanelProps {
  commonIssues?: InsightItem[];
  praisedFeatures?: InsightItem[];
}

/* Demo fallback */
const DEMO_COMMON_ISSUES: InsightItem[] = [
  { label: 'Late Delivery', count: 80 },
  { label: 'Bad Packaging', count: 55 },
  { label: 'Battery Issues', count: 40 },
  { label: 'Poor Support', count: 35 },
  { label: 'Wrong Item', count: 28 },
];

const DEMO_PRAISED_FEATURES: InsightItem[] = [
  { label: 'Battery Life', count: 70 },
  { label: 'Camera Quality', count: 60 },
  { label: 'Build Quality', count: 50 },
  { label: 'Value for Money', count: 45 },
  { label: 'Fast Shipping', count: 38 },
];

export const InsightsPanel = ({
  commonIssues,
  praisedFeatures,
}: InsightsPanelProps) => {
  const issues = commonIssues && commonIssues.length > 0
    ? commonIssues
    : DEMO_COMMON_ISSUES;

  const praises = praisedFeatures && praisedFeatures.length > 0
    ? praisedFeatures
    : DEMO_PRAISED_FEATURES;

  const CustomTooltip = ({ active, payload, color }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border bg-card">
          <p className="font-medium">{payload[0].payload.label}</p>
          <p style={{ color }}>{payload[0].value.toLocaleString()} mentions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Common Issues */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Top Complaint Categories</h3>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={issues.slice(0, 5)}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" width={75} />
              <Tooltip content={(props) => <CustomTooltip {...props} color="#F43F5E" />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {issues.slice(0, 5).map((_, index) => (
                  <Cell
                    key={index}
                    fill="#F43F5E"
                    opacity={1 - index * 0.15}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Praised Features */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-positive/10">
            <ThumbsUp className="w-5 h-5 text-positive" />
          </div>
          <h3 className="text-lg font-semibold">Most Praised Features</h3>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={praises.slice(0, 5)}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" width={75} />
              <Tooltip content={(props) => <CustomTooltip {...props} color="#2DD4BF" />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {praises.slice(0, 5).map((_, index) => (
                  <Cell
                    key={index}
                    fill="#2DD4BF"
                    opacity={1 - index * 0.15}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
