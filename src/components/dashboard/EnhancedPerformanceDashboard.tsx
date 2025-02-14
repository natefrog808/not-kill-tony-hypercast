import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, ThumbsUp, Activity, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ShowMetrics {
  audienceEngagement: number;
  laughterLevel: number;
  showProgress: number;
  performerRating: number;
}

interface HistoricalData {
  engagementHistory: number[];
  laughterHistory: number[];
}

const fetchRealTimeMetrics = async (): Promise<ShowMetrics> => {
  // Simulate real-time data fetching
  return {
    audienceEngagement: Math.random() * 100,
    laughterLevel: Math.random() * 100,
    showProgress: Math.random() * 100,
    performerRating: Math.random() * 100
  };
};

const fetchHistoricalData = async (): Promise<HistoricalData> => {
  // Simulate historical data fetching
  return {
    engagementHistory: Array.from({ length: 10 }, () => Math.random() * 100),
    laughterHistory: Array.from({ length: 10 }, () => Math.random() * 100)
  };
};

const EnhancedPerformanceDashboard: React.FC = () => {
  const [showMetrics, setShowMetrics] = useState<ShowMetrics>({
    audienceEngagement: 0,
    laughterLevel: 0,
    showProgress: 0,
    performerRating: 0
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    engagementHistory: [],
    laughterHistory: []
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const newMetrics = await fetchRealTimeMetrics();
      setShowMetrics(newMetrics);

      if (newMetrics.showProgress % 5 === 0) {
        const newData = await fetchHistoricalData();
        setHistoricalData(newData);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateTimeSeriesData = () => {
    return historicalData.engagementHistory.map((engagement, index) => ({
      time: `${index}m ago`,
      engagement,
      laughter: historicalData.laughterHistory[index]
    }));
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audience Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={showMetrics.audienceEngagement} />
              <div className="text-2xl font-bold">{showMetrics.audienceEngagement.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laughter Level</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={showMetrics.laughterLevel} />
              <div className="text-2xl font-bold">{showMetrics.laughterLevel.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Show Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={showMetrics.showProgress} />
              <div className="text-2xl font-bold">{showMetrics.showProgress.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performer Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={showMetrics.performerRating} />
              <div className="text-2xl font-bold">{showMetrics.performerRating.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#2563eb" />
                <Line type="monotone" dataKey="laughter" stroke="#059669" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPerformanceDashboard;
