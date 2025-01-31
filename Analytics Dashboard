```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, AreaChart, PieChart, Line, Bar, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, Clock, TrendingUp, Calendar, Award } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState({
    showMetrics: [],
    audienceMetrics: [],
    performerMetrics: [],
    engagementMetrics: []
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Shows"
          value="1,234"
          trend="+12%"
          icon={<Activity className="text-blue-500" />}
        />
        <MetricCard
          title="Active Users"
          value="45.2K"
          trend="+8%"
          icon={<Users className="text-green-500" />}
        />
        <MetricCard
          title="Avg. Show Duration"
          value="62m"
          trend="-3%"
          icon={<Clock className="text-purple-500" />}
        />
        <MetricCard
          title="Engagement Rate"
          value="87%"
          trend="+5%"
          icon={<TrendingUp className="text-orange-500" />}
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performers">Performers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Show Performance Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Show Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateShowData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="viewers" stroke="#8884d8" />
                    <Line type="monotone" dataKey="engagement" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generateAudienceData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateRatingsData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          {/* Audience Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateGrowthData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" fill="#8884d8" stroke="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={20} />
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateRealtimeData().map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {activity.icon}
                  <span>{activity.description}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, trend, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </span>
          </div>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
);

// Data Generation Functions
const generateShowData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    date: `${i}:00`,
    viewers: Math.floor(Math.random() * 1000) + 500,
    engagement: Math.floor(Math.random() * 50) + 50
  }));
};

const generateAudienceData = () => {
  return [
    { name: 'New', value: 400 },
    { name: 'Returning', value: 300 },
    { name: 'Regular', value: 200 }
  ];
};

const generateRatingsData = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    rating: i + 1,
    count: Math.floor(Math.random() * 100) + 20
  }));
};

const generateGrowthData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    users: Math.floor(Math.random() * 1000) + i * 100
  }));
};

const generateRealtimeData = () => {
  return [
    {
      icon: <Users size={16} className="text-blue-500" />,
      description: "New audience member joined",
      time: "Just now"
    },
    {
      icon: <Award size={16} className="text-green-500" />,
      description: "High engagement score recorded",
      time: "2m ago"
    },
    {
      icon: <Calendar size={16} className="text-purple-500" />,
      description: "New show scheduled",
      time: "5m ago"
    }
  ];
};

export default AnalyticsDashboard;
```
