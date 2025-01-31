```javascript
import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, AreaChart, ScatterChart, Line, Bar, Pie, Area, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ZoomAndPan } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const DataVisualizationSystem = () => {
  const [timeRange, setTimeRange] = useState('1d');
  const [chartType, setChartType] = useState('line');
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Fetch data dynamically and update metrics
    fetchData().then(data => setMetrics(data));
  }, [timeRange]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue>{timeRange}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="1d">1 Day</SelectItem>
            <SelectItem value="1w">1 Week</SelectItem>
            <SelectItem value="1m">1 Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-32">
            <SelectValue>{chartType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="pie">Pie</SelectItem>
            <SelectItem value="area">Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Visualization Area */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Brush />
                    <ZoomAndPan />
                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU Usage" />
                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory Usage" />
                    <Line type="monotone" dataKey="latency" stroke="#ffc658" name="Latency" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.resource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.errors}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
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
          <Card>
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.audience}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="viewers" fill="#8884d8" stroke="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Scatter name="Reactions" data={metrics.engagement} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interactive Features */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomAnalysisBuilder />
        </CardContent>
      </Card>
    </div>
  );
};

const CustomAnalysisBuilder = () => {
  const [metrics, setMetrics] = useState([]);
  const [dimensions, setDimensions] = useState([]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue>Select Metric</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewers">Viewers</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
            <SelectItem value="retention">Retention</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-48">
            <SelectValue>Select Dimension</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="device">Device</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px] bg-gray-100 rounded-lg">
        {/* Dynamic visualization area */}
      </div>
    </div>
  );
};

const fetchData = async () => {
  // Simulate fetching data
  return {
    performance: generatePerformanceData(),
    resource: generateResourceData(),
    errors: generateErrorData(),
    audience: generateAudienceData(),
    engagement: generateEngagementData(),
  };
};

// Data Generation Functions
const generatePerformanceData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    latency: Math.random() * 1000
  }));
};

const generateResourceData = () => {
  return [
    { name: 'CPU', value: 40 },
    { name: 'Memory', value: 30 },
    { name: 'Storage', value: 20 },
    { name: 'Network', value: 10 }
  ];
};

const generateErrorData = () => {
  return [
    { type: '4xx', count: Math.floor(Math.random() * 100) },
    { type: '5xx', count: Math.floor(Math.random() * 50) },
    { type: 'Network', count: Math.floor(Math.random() * 30) },
    { type: 'Other', count: Math.floor(Math.random() * 20) }
  ];
};

const generateAudienceData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    viewers: Math.floor(Math.random() * 1000) + 500
  }));
};

const generateEngagementData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    time: i,
    value: Math.random() * 100,
    size: Math.random() * 20
  }));
};

export default DataVisualizationSystem;
```
