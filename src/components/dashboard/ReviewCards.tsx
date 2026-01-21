import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';

type SentimentType = 'positive' | 'neutral' | 'negative';

interface ReviewCardsProps {
  samples?: {
    positive?: string[];
    neutral?: string[];
    negative?: string[];
  };
}

const sentimentConfig = {
  positive: {
    label: 'Positive',
    color: '#2DD4BF',
    bgClass: 'bg-positive/10',
    borderClass: 'border-positive/30',
    textClass: 'text-positive',
  },
  neutral: {
    label: 'Neutral',
    color: '#F59E0B',
    bgClass: 'bg-warning/10',
    borderClass: 'border-warning/30',
    textClass: 'text-warning',
  },
  negative: {
    label: 'Negative',
    color: '#F43F5E',
    bgClass: 'bg-destructive/10',
    borderClass: 'border-destructive/30',
    textClass: 'text-destructive',
  },
};

/* Demo fallback reviews */
const DEMO_REVIEWS: Record<SentimentType, string[]> = {
  positive: [
    'Amazing product, exceeded my expectations.',
    'Great value for money and fast delivery.',
    'Quality is excellent, highly recommended!',
  ],
  neutral: [
    'Product is okay, does the job.',
    'Average experience, nothing special.',
    'Decent quality for the price.',
  ],
  negative: [
    'Very disappointed with the product.',
    'Stopped working after a few days.',
    'Customer support was unhelpful.',
  ],
};

const ReviewCard = ({
  review,
  sentiment,
  index,
}: {
  review: string;
  sentiment: SentimentType;
  index: number;
}) => {
  const config = sentimentConfig[sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`glass-card p-4 border ${config.borderClass} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgClass}`}>
          <MessageSquare className={`w-4 h-4 ${config.textClass}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}
            >
              {config.label}
            </span>

            <div className="flex gap-0.5">
              {[...Array(sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 3 : 1)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3"
                    fill={config.color}
                    color={config.color}
                  />
                )
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            “{review}”
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const ReviewCards = ({ samples }: ReviewCardsProps) => {
  const sentiments: SentimentType[] = ['positive', 'neutral', 'negative'];

  const safeSamples = {
    positive: samples?.positive?.length ? samples.positive : DEMO_REVIEWS.positive,
    neutral: samples?.neutral?.length ? samples.neutral : DEMO_REVIEWS.neutral,
    negative: samples?.negative?.length ? samples.negative : DEMO_REVIEWS.negative,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Sample Reviews by Sentiment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sentiments.map((sentiment) => (
          <div key={sentiment} className="space-y-3">
            <h4
              className={`text-sm font-semibold uppercase tracking-wide ${sentimentConfig[sentiment].textClass}`}
            >
              {sentimentConfig[sentiment].label} Reviews
            </h4>

            <div className="space-y-3">
              {safeSamples[sentiment].slice(0, 3).map((review, index) => (
                <ReviewCard
                  key={index}
                  review={review}
                  sentiment={sentiment}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
