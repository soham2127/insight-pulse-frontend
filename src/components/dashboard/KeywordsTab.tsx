import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
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
interface RawKeyword {
  word: string;
  count?: number;
  doc_frequency?: number;
}

interface KeywordsTabProps {
  positive?: RawKeyword[];
  negative?: RawKeyword[];
}

/* Demo fallback */
const generateDemoKeywords = () => ({
  positive: [
    { word: 'excellent', count: 156 },
    { word: 'amazing', count: 134 },
    { word: 'great', count: 128 },
    { word: 'love', count: 112 },
    { word: 'perfect', count: 98 },
  ],
  negative: [
    { word: 'broken', count: 89 },
    { word: 'terrible', count: 76 },
    { word: 'slow', count: 67 },
    { word: 'disappointed', count: 58 },
    { word: 'refund', count: 38 },
  ],
});

/* Normalize backend → UI format */
const normalizeKeywords = (data?: RawKeyword[]) => {
  if (!data || data.length === 0) return [];

  return data.map((k) => ({
    word: k.word,
    count: k.count ?? k.doc_frequency ?? 0,
  }));
};

export const KeywordsTab = ({ positive, negative }: KeywordsTabProps) => {
  const demo = generateDemoKeywords();

  const positiveData =
    normalizeKeywords(positive).length > 0
      ? normalizeKeywords(positive)
      : demo.positive;

  const negativeData =
    normalizeKeywords(negative).length > 0
      ? normalizeKeywords(negative)
      : demo.negative;

  return (
    <div className="space-y-6">
      {/* Positive Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp className="w-5 h-5 text-positive" />
          <h3 className="text-lg font-semibold">Top Positive Keywords</h3>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={positiveData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="word" width={75} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {positiveData.map((_, index) => (
                  <Cell key={index} fill="hsl(var(--positive))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Negative Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <ThumbsDown className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold">Top Negative Keywords</h3>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={negativeData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="word" width={75} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {negativeData.map((_, index) => (
                  <Cell key={index} fill="hsl(var(--destructive))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
