import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SentimentPieChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

const COLORS = {
  Positive: '#2DD4BF',
  Neutral: '#F59E0B',
  Negative: '#F43F5E',
};

export const SentimentPieChart = ({ positive, neutral, negative }: SentimentPieChartProps) => {
  const total = positive + neutral + negative;
  
  const data = [
    { name: 'Positive', value: positive, color: COLORS.Positive, percentage: ((positive / total) * 100).toFixed(1) },
    { name: 'Neutral', value: neutral, color: COLORS.Neutral, percentage: ((neutral / total) * 100).toFixed(1) },
    { name: 'Negative', value: negative, color: COLORS.Negative, percentage: ((negative / total) * 100).toFixed(1) },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 !bg-card border border-border">
          <p className="font-semibold" style={{ color: item.color }}>
            {item.name}
          </p>
          <p className="text-foreground">{item.percentage}% ({item.value.toLocaleString()} reviews)</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-semibold text-sm"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  const CustomLegend = () => (
    <div className="flex justify-center gap-6 mt-4">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: item.color,
              boxShadow: `0 0 8px ${item.color}60`
            }}
          />
          <span className="text-sm text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Sentiment Share (%)</h3>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                  style={{
                    filter: `drop-shadow(0 0 12px ${entry.color}40)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </motion.div>
  );
};
