import React, { useEffect, useState } from 'react';
import { Sprout, Tractor, ClipboardList, CheckCircle, Circle, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ farms: 0, seasons: 0, pendingTasks: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load User
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Load Data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Parallel requests for speed
      const [farmsRes, tasksRes] = await Promise.all([
        api.get('/farms'),
        api.get('/tasks')
      ]);

      const farms = farmsRes.data;
      const allTasks = tasksRes.data;

      // Calculate Stats
      const activeFarms = farms.length;
      // Count active seasons by checking internal farm data if available, or just use 0 for now
      // (For MVP, we just count farms. Later we can count exact seasons)
      const pending = allTasks.filter(t => !t.isCompleted).length;

      setStats({
        farms: activeFarms,
        seasons: farms.reduce((acc, farm) => acc + (farm.seasons?.length || 0), 0),
        pendingTasks: pending
      });

      setTasks(allTasks);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      // Optimistic UI Update (Update screen before server responds)
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, isCompleted: !currentStatus } : t
      ));

      // Call Server
      await api.patch(`/tasks/${taskId}`, { isCompleted: !currentStatus });
      
      // Update stats count
      setStats(prev => ({
        ...prev,
        pendingTasks: !currentStatus ? prev.pendingTasks - 1 : prev.pendingTasks + 1
      }));
    } catch (error) {
      console.error("Task update failed", error);
      fetchDashboardData(); // Revert on error
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-earth-800">
          Welcome back, <span className="text-primary-600">{user.name || "Farmer"}</span>! 🌾
        </h1>
        <p className="text-gray-500 mt-2">Here is your daily overview.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Sprout} label="Active Farms" value={stats.farms} color="bg-green-100 text-green-700" />
        <StatCard icon={Tractor} label="Active Seasons" value={stats.seasons} color="bg-orange-100 text-orange-700" />
        <StatCard icon={ClipboardList} label="Tasks Pending" value={stats.pendingTasks} color="bg-blue-100 text-blue-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Task List (Takes up 2 spaces) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-earth-800">Your Task List</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                <p className="text-gray-500">All caught up! No tasks for today.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`p-4 border-b border-gray-100 flex items-start gap-4 transition-colors ${task.isCompleted ? 'bg-gray-50' : 'hover:bg-green-50/30'}`}
                >
                  <button 
                    onClick={() => handleToggleTask(task.id, task.isCompleted)}
                    className="mt-1 shrink-0"
                  >
                    {task.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-green-500 transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-earth-800'}`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">{task.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${getUrgencyColor(task.dueDate, task.isCompleted)}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Sprout className="w-3 h-3" />
                        {task.season.farm.name} ({task.season.crop})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Weather or Quick Actions (Placeholder for now) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-1">Weather Forecast</h3>
            <p className="text-primary-100 text-sm mb-4">Patna, Bihar</p>
            <div className="flex items-center gap-4">
               <div className="text-4xl font-bold">28°C</div>
               <div className="text-primary-100">Sunny</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function getUrgencyColor(dateStr, isCompleted) {
  if (isCompleted) return 'text-gray-400';
  const today = new Date();
  const due = new Date(dateStr);
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  
  if (diff < 0) return 'text-red-500 font-bold'; // Overdue
  if (diff <= 2) return 'text-orange-500 font-bold'; // Due soon
  return 'text-green-600';
}