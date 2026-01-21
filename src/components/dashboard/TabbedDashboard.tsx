import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Tags, Layers, Package, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SentimentData } from '@/types/sentiment';
import { SentimentBarChart } from './SentimentBarChart';
import { SentimentPieChart } from './SentimentPieChart';
import { SummaryStats } from './SummaryStats';
import { InsightsPanel } from './InsightsPanel';
import { ReviewCards } from './ReviewCards';
import { KeywordsTab } from './KeywordsTab';
import { AspectsTab } from './AspectsTab';
import { ProductsTab } from './ProductsTab';

interface TabbedDashboardProps {
  data: SentimentData | any; // allow backend response
  onExport: () => void;
}

export const TabbedDashboard = ({ data, onExport }: TabbedDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // ===============================
  // 🔁 NORMALIZE BACKEND RESPONSE
  // ===============================

  const sentimentSummary = data?.summary?.sentiment_summary;

  const positive = sentimentSummary?.positive ?? 0;
  const neutral = sentimentSummary?.neutral ?? 0;
  const negative = sentimentSummary?.negative ?? 0;

  const totalReviews =
    data?.summary?.total_reviews ??
    positive + neutral + negative;

  const keywords = {
    positive: data?.data?.positive_keywords ?? [],
    negative: data?.data?.negative_keywords ?? [],
  };

  const aspects = data?.data?.aspect_sentiment ?? [];
  const products = data?.data?.top_products ?? [];

  // Backend does NOT send these yet → safe fallbacks
  const commonIssues: Array<{ label: string; count: number }> = [];
  const praisedFeatures: Array<{ label: string; count: number }> = [];
  const samples = {
    positive: [],
    neutral: [],
    negative: [],
  };

  // Safety guard
  if (!data) {
    return (
      <div className="text-center text-muted-foreground">
        No analysis data available.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-muted-foreground">
            {totalReviews.toLocaleString()} reviews analyzed
          </p>
        </div>

        <Button onClick={onExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="w-4 h-4 hidden sm:inline" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-1.5 text-xs sm:text-sm">
            <Tags className="w-4 h-4 hidden sm:inline" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="aspects" className="gap-1.5 text-xs sm:text-sm">
            <Layers className="w-4 h-4 hidden sm:inline" />
            Aspects
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5 text-xs sm:text-sm">
            <Package className="w-4 h-4 hidden sm:inline" />
            Products
          </TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview" className="space-y-6">
          <SummaryStats
            positive={positive}
            neutral={neutral}
            negative={negative}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SentimentBarChart
              positive={positive}
              neutral={neutral}
              negative={negative}
            />
            <SentimentPieChart
              positive={positive}
              neutral={neutral}
              negative={negative}
            />
          </div>

          <InsightsPanel
            commonIssues={commonIssues}
            praisedFeatures={praisedFeatures}
          />

          <ReviewCards samples={samples} />
        </TabsContent>

        {/* ================= KEYWORDS ================= */}
        <TabsContent value="keywords">
          <KeywordsTab
            positive={keywords.positive}
            negative={keywords.negative}
          />
        </TabsContent>

        {/* ================= ASPECTS ================= */}
        <TabsContent value="aspects">
          <AspectsTab aspects={aspects} />
        </TabsContent>

        {/* ================= PRODUCTS ================= */}
        <TabsContent value="products">
          <ProductsTab products={products} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
