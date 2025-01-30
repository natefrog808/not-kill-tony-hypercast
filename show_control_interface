```javascript
import React, { useState, useEffect } from 'react';
import { Clock, Users, Mic2, Video, BarChart, Settings, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ShowControl = () => {
  const [showState, setShowState] = useState({
    status: 'standby',
    timeElapsed: 0,
    audienceCount: 0,
    technicalStatus: {
      audio: 'optimal',
      video: 'optimal',
      network: 'optimal'
    }
  });

  const [metrics, setMetrics] = useState({
    audienceEngagement: 0,
    laughterLevel: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
        audienceCount: prev.audienceCount + Math.floor(Math.random() * 5)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={showState.status === 'live' ? 'text-green-500' : 'text-gray-500'} />
                <span>Show Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{showState.audienceCount} viewers</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Status:</span>
                  <span className="font-bold">{showState.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Elapsed:</span>
                  <span>{Math.floor(showState.timeElapsed / 60)}:{(showState.timeElapsed % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className={`w-full ${showState.status === 'live' ? 'bg-red-500' : 'bg-green-500'}`}
                  onClick={() => setShowState(prev => ({
                    ...prev,
                    status: prev.status === 'live' ? 'standby' : 'live'
                  }))}
                >
                  {showState.status === 'live' ? 'END SHOW' : 'START SHOW'}
                </Button>
                <Button 
                  className="w-full bg-blue-500"
                  onClick={() => setShowState(prev => ({
                    ...prev,
                    status: prev.status === 'break' ? 'live' : 'break'
                  }))}
                >
                  {showState.status === 'break' ? 'RESUME SHOW' : 'TAKE BREAK'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Technical Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic2 size={16} />
                  <span>Audio</span>
                </div>
                <span className={`px-2 py-1 rounded ${
                  showState.technicalStatus.audio === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {showState.technicalStatus.audio}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  <span>Video</span>
                </div>
                <span className={`px-2 py-1 rounded ${
                  showState.technicalStatus.video === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {showState.technicalStatus.video}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Controls */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Performer Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {showState.performerQueue.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span>{performer.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline" className="text-red-500">Remove</Button>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">Add Performer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} />
              Live Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Audience Engagement</div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${metrics.audienceEngagement}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Laughter Level</div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${metrics.laughterLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="space-y-2">
        {showState.technicalStatus.audio !== 'optimal' && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Audio quality is degraded. Check audio input settings.
            </AlertDescription>
          </Alert>
        )}
        {showState.technicalStatus.video !== 'optimal' && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Video quality is degraded. Check video settings.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ShowControl;
```
