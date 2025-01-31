```javascript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Book, Video, CheckCircle, Clock, Award, Trophy } from 'lucide-react';

const TrainingPlatform = () => {
  const [userProgress, setUserProgress] = useState({
    completedModules: 0,
    totalModules: 8,
    currentModule: 'basics',
    certificates: [],
    badges: []
  });

  const handleFeedback = (feedback) => {
    console.log('User feedback:', feedback);
    // Process feedback
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header and Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>AI Kill Tony Training Platform</span>
            <div className="flex items-center gap-2">
              <Progress value={(userProgress.completedModules / userProgress.totalModules) * 100} />
              <span>{Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}% Complete</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Book size={20} />
              <span>{userProgress.completedModules} of {userProgress.totalModules} Modules Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span>{userProgress.certificates.length} Certificates Earned</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={20} />
              <span>{userProgress.badges.length} Badges Earned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Tabs defaultValue="basics">
        <TabsList className="w-full">
          <TabsTrigger value="basics">System Basics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Operations</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <ModuleCard
            title="Introduction to AI Kill Tony"
            description="Learn the basics of the AI Kill Tony system and its core components."
            duration="30 min"
            lessons={[
              "System Overview",
              "Key Components",
              "Basic Operations",
              "User Interface Tour"
            ]}
            progress={100}
          />

          <ModuleCard
            title="Show Management"
            description="Master the fundamentals of running an AI Kill Tony show."
            duration="45 min"
            lessons={[
              "Starting a Show",
              "Managing Performers",
              "Audience Interaction",
              "Show Controls"
            ]}
            progress={75}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <ModuleCard
            title="Advanced Show Features"
            description="Learn advanced techniques for show management and optimization."
            duration="60 min"
            lessons={[
              "Performance Optimization",
              "Custom Show Settings",
              "Analytics Dashboard",
              "Advanced Controls"
            ]}
            progress={50}
          />

          <ModuleCard
            title="System Administration"
            description="Master system administration and maintenance tasks."
            duration="90 min"
            lessons={[
              "System Configuration",
              "Performance Monitoring",
              "Backup Management",
              "Update Procedures"
            ]}
            progress={25}
          />
        </TabsContent>
      </Tabs>

      {/* Interactive Practice Area */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <PracticeModule
              title="Show Simulation"
              description="Practice running a show in a safe environment"
              status="available"
            />
            <PracticeModule
              title="Troubleshooting Scenarios"
              description="Handle common issues in a simulated environment"
              status="available"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Provide your feedback here..."
            onBlur={(e) => handleFeedback(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const ModuleCard = ({ 
  title, 
  description, 
  duration, 
  lessons, 
  progress 
}: ModuleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>
          
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle 
                  size={16} 
                  className={progress >= ((index + 1) / lessons.length) * 100 ? 'text-green-500' : 'text-gray-300'} 
                />
                <span>{lesson}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Progress value={progress} />
            <div className="flex justify-between text-sm mt-1">
              <span>{progress}% Complete</span>
              <span>{Math.round((progress / 100) * lessons.length)} of {lessons.length} Lessons</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PracticeModule = ({ 
  title, 
  description, 
  status 
}: PracticeModuleProps) => {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <button 
            className={`mt-4 px-4 py-2 rounded ${
              status === 'available' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            Start Practice
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingPlatform;
```
