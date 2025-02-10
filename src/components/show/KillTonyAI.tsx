```javascript
import React, { useState, useMemo, useEffect } from 'react';
import { Users, Mic2, Clock, MessageSquare, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KillTonyAI = () => {
  const [currentPerformer, setCurrentPerformer] = useState('Virtual Comic #127');
  const [timeRemaining, setTimeRemaining] = useState('0:60');
  const [audienceSize, setAudienceSize] = useState(342);

  // Memoize audience reactions to avoid unnecessary recalculations
  const audienceReactions = useMemo(() => ['😂', '🔥', '👏', '💀'].map((reaction, i) => ({
    id: i,
    icon: reaction,
    width: `${Math.random() * 100}%`
  })), []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => `0:${Math.max(0, parseInt(prev.split(':')[1]) - 1)}`);
      setAudienceSize(prev => prev + Math.floor(Math.random() * 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Main Stage */}
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic2 className="text-red-500" />
              <span>LIVE: Kill Tony AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{audienceSize} watching</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* Host Panel */}
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle className="text-sm">Hosts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['AI Tony', 'AI Brian'].map((host, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <div>
                      <div className="font-bold">{host}</div>
                      <div className="text-xs">{index === 0 ? 'Head Host' : 'Co-Host'}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Area */}
            <Card className="bg-gray-800 col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{currentPerformer}</span>
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <span>{timeRemaining}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interaction Panel */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare size={16} />
                  Audience Reactions
                </CardTitle>
              </CardHeader>
              <CardContent className="h-32 overflow-y-auto">
                <div className="space-y-2">
                  {audienceReactions.map(({ id, icon, width }) => (
                    <div key={id} className="flex items-center gap-2">
                      <span>{icon}</span>
                      <div className="h-1 bg-blue-500 rounded" style={{ width }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award size={16} />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Laugh Score:</span>
                    <span>7.8/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crowd Energy:</span>
                    <span>High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KillTonyAI;
```
