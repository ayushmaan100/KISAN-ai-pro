// Dashboard page/component
//
// Contract:
// - Inputs: none (this component does not accept props)
// - Output: a small JSX element (a greeting) rendered where the component is used
// - Error modes: none (pure presentational component)

import React, { useEffect, useState } from 'react';
import { Sprout, Tractor, ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Get user details from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div>
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-earth-800">
          Welcome back, <span className="text-primary-600">{user.phone}</span>! 🌾
        </h1>
        <p className="text-gray-500 mt-2">
          Here is what's happening on your farms today.
        </p>
      </header>

      {/* Statistics Cards (Placeholders for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Sprout} 
          label="Active Farms" 
          value="0" 
          color="bg-green-100 text-green-700" 
        />
        <StatCard 
          icon={Tractor} 
          label="Current Seasons" 
          value="0" 
          color="bg-orange-100 text-orange-700" 
        />
        <StatCard 
          icon={ClipboardList} 
          label="Pending Tasks" 
          value="0" 
          color="bg-blue-100 text-blue-700" 
        />
      </div>

      {/* Empty State / Call to Action */}
      <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200 hover:border-primary-200 transition-colors">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Farms Added Yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Start by adding your first farm to track crops, soil health, and weather conditions.
        </p>
        <Link to="/farms" className="btn-primary inline-flex shadow-lg shadow-primary-600/20">
          <Plus className="w-5 h-5" />
          Add Your First Farm
        </Link>
      </div>
    </div>
  );
}

// Helper Component for the Stats
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
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