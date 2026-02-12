import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MapPin, Droplets, Ruler, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api';

export default function AddFarm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    state: '',
    landSize: '',
    soilType: 'LOAMY', // Default
    irrigationType: 'TUBEWELL' // Default
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to our working API
      await api.post('/farms', formData);
      // Redirect to the Farms list on success
      navigate('/farms');
    } catch (error) {
      alert("Failed to add farm. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-green-50/50">
          <h1 className="text-2xl font-bold text-earth-800 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary-600" />
            Add New Farm
          </h1>
          <p className="text-gray-500 mt-1">Enter details to get AI crop recommendations.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Farm Identity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
            <input 
              name="name" 
              required
              placeholder="e.g. Riverside Plot" 
              className="input-field"
              onChange={handleChange}
            />
          </div>

          {/* Location Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> District
              </label>
              <input 
                name="district" 
                required
                placeholder="e.g. Patna" 
                className="input-field"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input 
                name="state" 
                required
                placeholder="e.g. Bihar" 
                className="input-field"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Land Details Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Ruler className="w-4 h-4 text-gray-400" /> Size (Acres)
              </label>
              <input 
                name="landSize" 
                type="number"
                step="0.1"
                required
                placeholder="2.5" 
                className="input-field"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
              <select name="soilType" className="input-field bg-white" onChange={handleChange}>
                <option value="LOAMY">Loamy (Recommended)</option>
                <option value="CLAY">Clay</option>
                <option value="SANDY">Sandy</option>
                <option value="BLACK">Black</option>
                <option value="RED">Red</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Droplets className="w-4 h-4 text-gray-400" /> Irrigation
              </label>
              <select name="irrigationType" className="input-field bg-white" onChange={handleChange}>
                <option value="TUBEWELL">Tube Well</option>
                <option value="CANAL">Canal</option>
                <option value="RAINFED">Rainfed</option>
                <option value="DRIP">Drip System</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Farm Details"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}