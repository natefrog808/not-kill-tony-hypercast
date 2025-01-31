```javascript
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Cpu, Server, Users, AlertTriangle, CheckCircle, Database, Clock } from 'lucide-react';

const MonitoringDashboard = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    performance: {
      cpu: 0,
      memory: 0,
      latency: 0,
      errors: 0
    },
    show: {
      activeUsers: 0,
      performerQueue: 0,
      responseTime: 0,
      uptime: 0
    },
    alerts: []
  });

  useEffect(() => {
    // Simulate fetching data from an API
    const interval = setInterval(() => {
      setSystemMetrics({
        performance: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          latency: Math.random() * 200,
          errors: Math.floor(Math.random() * 10)
        },
        show: {
          activeUsers: Math.floor(Math.random() * 1000),
          performerQueue: Math.floor(Math.random() * 50),
          responseTime: Math.random() * 200,
          uptime: Math.floor(Math.random() * 10000)
        },
        alerts: [{
          message: 'CPU usage high',
          severity: 'high',
          timestamp: Date.now() - Math.floor(Math.random() * 300000)
        }]
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard
          title="System Health"
          value={systemMetrics.performance.errors === 0 ? 'Healthy' : 'Warning'}
          icon={<CheckCircle className={systemMetrics.performance.errors === 0 ? 'text-green-500' : 'text-yellow-500'} />}
        />
        <StatusCard
          title="Active Users"
          value={systemMetrics.show.activeUsers}
          icon={<Users className="text-blue-500" />}
        />
        <StatusCard
          title="Response Time"
          value={`${systemMetrics.show.responseTime.toFixed(2)}ms`}
          icon={<Clock className="text-purple-500" />}
        />
        <StatusCard
          title="Uptime"
          value={formatUptime(systemMetrics.show.uptime)}
          icon={<Activity className="text-green-500" />}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu size={20} />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generatePerformanceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} />
              Show Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateShowMetrics()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#ff7300" />
                <Line type="monotone" dataKey="latency" stroke="#387908" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Resource Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <ResourceMeter
              label="CPU Usage"
              value={systemMetrics.performance.cpu}
              type="cpu"
            />
            <ResourceMeter
              label="Memory Usage"
              value={systemMetrics.performance.memory}
              type="memory"
            />
            <ResourceMeter
              label="Network Load"
              value={calculateNetworkLoad()}
              type="network"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {systemMetrics.alerts.map((alert, index) => (
              <Alert key={index} variant={alert.severity}>
                <AlertDescription>
                  {alert.message}
                  <span className="text-sm text-gray-500 ml-2">
                    {formatAlertTime(alert.timestamp)}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
            {systemMetrics.alerts.length === 0 && (
              <div className="text-center text-gray-500">
                No active alerts
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatusCard = ({ title, value, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
);

const ResourceMeter = ({ label, value, type }) => {
  const getColor = (value) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full ${getColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Utility Functions
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const generatePerformanceData = () => {
  // Generate sample performance data
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.random() * 100,
    memory: Math.random() * 100
  }));
};

const generateShowMetrics = () => {
  // Generate sample show metrics
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    users: Math.floor(Math.random() * 1000),
    latency: Math.random() * 200
  }));
};

const calculateNetworkLoad = () => {
  // Calculate network load percentage
  return Math.floor(Math.random() * 100);
};

const formatAlertTime = (timestamp) => {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  return `${minutes} minutes ago`;
};

export default MonitoringDashboard;
```
