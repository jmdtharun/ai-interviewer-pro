'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

interface AnalyticsChartsProps {
  topicData: { topic: string; avg_score: number }[];
  emotionData: { emotion: string; percentage: number }[];
  activityData: { date: string; interviews: number; users: number }[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsCharts({ topicData, emotionData, activityData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Daily Interview Activity Chart */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-3">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">Daily Platform Interview Activity</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#131926', borderColor: '#1F293D', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="interviews" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Interviews" />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Active Candidates" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Average Score by Topic Bar Chart */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-3">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">Average Candidate Score by Topic</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
              <XAxis dataKey="topic" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#131926', borderColor: '#1F293D', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="avg_score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Emotion Distribution Pie Chart */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-3 lg:col-span-2">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">Candidate Emotion & Behavioral Demeanor Distribution</h4>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="percentage"
                nameKey="emotion"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#131926', borderColor: '#1F293D', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
