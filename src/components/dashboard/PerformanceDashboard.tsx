import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, ThumbsUp, Activity, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PerformanceData {
  audienceMetrics: {
    engagement: number;
    sentiment: number;
    activeUsers: number;
    peakLaughter: number;
  };
  systemMetrics: {
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
  recentEvents: Array<{
    type: string;
    timestamp: string;
  }>;
}

const PerformanceDashboard: React.FC = () => {
  const [performanceData] = useState<PerformanceData>({
    audienceMetrics: {
      engagement: 85,
      sentiment: 0.75,
      activeUsers: 250,
      peakLaughter: 0.92
    },
    systemMetrics: {
      responseTime: 120,
      uptime: 99.99,
      errorRate: 0.01
    },
    recentEvents: [
      { type: 'peak_laughter', timestamp: '20:45:30' },
      { type: 'audience_growth', timestamp: '20:46:00' },
      { type: 'performance_milestone', timestamp: '20:47:30' }
    ]
  });

  const generateMockTimeSeriesData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        time: `${i}:00`,
        engagement: Math.random() * 30 + 70,
        sentiment: Math.random() * 20 + 70,
        responseTime: Math.random() * 50 + 100,
        errorRate: Math.random() * 0.5
      });
    }
    return data;
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
            <div className="text-2xl font-bold">{performanceData.audienceMetrics.engagement}%</div>
            <p className="text-xs text-muted-foreground">+2% from last segment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audience Sentiment</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(performanceData.audienceMetrics.sentiment * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Positive reactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Response</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.systemMetrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">Avg. response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.audienceMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Current viewers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Audience Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateMockTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#2563eb" />
                <Line type="monotone" dataKey="sentiment" stroke="#059669" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateMockTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="responseTime" stroke="#dc2626" />
                <Line type="monotone" dataKey="errorRate" stroke="#9333ea" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.recentEvents.map((event, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {event.type.replace('_', ' ')} at {event.timestamp}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
