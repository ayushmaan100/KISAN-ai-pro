import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Default styles
import { CheckCircle, Circle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import api from '../api';

export default function Planner() {

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get tasks for the selected date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Helper: Render dots on calendar tiles if tasks exist
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="flex gap-1 mt-1">
             {/* Show up to 3 dots */}
            {dayTasks.slice(0, 3).map((_, i) => (
              <div key={i} className={`dot ${dayTasks[i].isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
            ))}
          </div>
        );
      }
    }
  };

  const selectedTasks = getTasksForDate(selectedDate);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-earth-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary-600" />
          Season Planner
        </h1>
        <p className="text-gray-500">View and manage your farming schedule.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            tileContent={tileContent}
            className="w-full border-0"
          />
        </div>

        {/* Right: Task List for Selected Day */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold text-lg text-earth-800 mb-4 border-b border-gray-100 pb-2">
            Tasks for {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
          </h2>
          
          {selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks scheduled for this day.</p>
              <p className="text-sm mt-2">Enjoy your rest! 🌿</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTasks.map(task => (
                <div key={task.id} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                   <div className="mt-1">
                     {task.isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-orange-400" />}
                   </div>
                   <div>
                     <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
                     <p className="text-xs text-gray-500 mt-1">{task.season.farm.name}</p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}