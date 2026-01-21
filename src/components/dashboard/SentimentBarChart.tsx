import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SentimentBarChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

const COLORS = {
  Positive: '#2DD4BF',
  Neutral: '#F59E0B',
  Negative: '#F43F5E',
};

export const SentimentBarChart = ({ positive, neutral, negative }: SentimentBarChartProps) => {
  const data = [
    { name: 'Positive', value: positive, color: COLORS.Positive },
    { name: 'Neutral', value: neutral, color: COLORS.Neutral },
    { name: 'Negative', value: negative, color: COLORS.Negative },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 !bg-card border border-border">
          <p className="font-semibold" style={{ color: item.color }}>
            {item.name}
          </p>
          <p className="text-foreground">{item.value.toLocaleString()} reviews</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Overall Sentiment Distribution</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Review Count', 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--muted-foreground))'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}40)`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
