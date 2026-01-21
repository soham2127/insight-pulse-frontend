import { motion } from 'framer-motion';
import { Package, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* Accept raw backend + demo shapes */
interface RawProduct {
  name?: string;
  ProductName?: string;
  positive?: number;
  neutral?: number;
  negative?: number;
  Positive?: number;
  Neutral?: number;
  Negative?: number;
  score?: number;
  Total?: number;
}

interface ProductsTabProps {
  products: RawProduct[];
}

/* Demo fallback */
const generateDemoProducts = () => [
  { name: 'Wireless Earbuds Pro', positive: 245, negative: 32, neutral: 48 },
  { name: 'Smart Watch Ultra', positive: 189, negative: 45, neutral: 56 },
  { name: 'USB-C Charger 65W', positive: 156, negative: 12, neutral: 28 },
];

/* Compute score from sentiment */
const computeScore = (p: number, n: number, neu: number) => {
  const total = p + n + neu;
  if (total === 0) return 0;
  return Math.round((p / total) * 100);
};

export const ProductsTab = ({ products }: ProductsTabProps) => {
  /* Normalize data */
  const normalized = (products && products.length > 0 ? products : generateDemoProducts()).map(
    (item) => {
      const positive = item.positive ?? item.Positive ?? 0;
      const neutral = item.neutral ?? item.Neutral ?? 0;
      const negative = item.negative ?? item.Negative ?? 0;

      return {
        name: item.name ?? item.ProductName ?? 'Unknown Product',
        positive,
        neutral,
        negative,
        score: item.score ?? computeScore(positive, negative, neutral),
      };
    }
  );

  /* Sort safely */
  const sortedData = [...normalized].sort((a, b) => b.score - a.score);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'hsl(var(--positive))';
    if (score >= 50) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <TrendingUp className="w-4 h-4 text-positive" />;
    if (score >= 50) return <Minus className="w-4 h-4 text-warning" />;
    return <TrendingDown className="w-4 h-4 text-destructive" />;
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
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Product Sentiment Scores</h3>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(v: number) => [`${v}/100`, 'Score']} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell key={index} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Product Sentiment Details</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product</th>
                <th className="text-center p-3 text-positive">Positive</th>
                <th className="text-center p-3 text-warning">Neutral</th>
                <th className="text-center p-3 text-destructive">Negative</th>
                <th className="text-center p-3">Score</th>
                <th className="text-center p-3">Trend</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((product, index) => (
                <motion.tr
                  key={product.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/20"
                >
                  <td className="p-3 font-medium flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {product.name}
                  </td>
                  <td className="p-3 text-center text-positive">{product.positive}</td>
                  <td className="p-3 text-center text-warning">{product.neutral}</td>
                  <td className="p-3 text-center text-destructive">{product.negative}</td>
                  <td className="p-3 text-center">
                    <span
                      className="px-2 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${getScoreColor(product.score)}20`,
                        color: getScoreColor(product.score),
                      }}
                    >
                      {product.score}
                    </span>
                  </td>
                  <td className="p-3 text-center">{getScoreIcon(product.score)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
