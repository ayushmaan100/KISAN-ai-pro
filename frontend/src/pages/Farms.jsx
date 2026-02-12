import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, Droplets, Plus, Loader2, Ruler, ArrowRight } from 'lucide-react';
import api from '../api';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch farms when the component loads
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      setFarms(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load farms. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-earth-800">My Farms</h1>
          <p className="text-gray-500">Manage your land and crop cycles</p>
        </div>
        <Link to="/farms/add" className="btn-primary shrink-0">
          <Plus className="w-5 h-5" />
          Add New Farm
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Empty State (If no farms exist) */}
      {!loading && farms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No farms added yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Add your farm details to start tracking crops, expenses, and weather.
          </p>
          <Link to="/farms/add" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline">
            + Create your first farm
          </Link>
        </div>
      )}

      {/* Farm Grid (If farms exist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <div 
            key={farm.id} 
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-earth-800 group-hover:text-primary-700 transition-colors">
                  {farm.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> 
                  {farm.district}, {farm.state}
                </p>
              </div>
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                Active
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-earth-100/50 p-3 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> Land Size
                </p>
                <p className="font-semibold text-earth-800">{farm.landSize} Acres</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-xs text-blue-500 mb-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> Water
                </p>
                <p className="font-semibold text-blue-700 capitalize">
                  {farm.irrigationType?.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Soil: <span className="font-medium text-gray-700 capitalize">{farm.soilType.toLowerCase()}</span>
              </div>
              
              <button className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}