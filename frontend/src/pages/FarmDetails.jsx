import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sprout, Calendar, CheckCircle, Circle, ArrowLeft, Loader2, X, AlertTriangle } from 'lucide-react';
import api from '../api';

export default function FarmDetails() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  
  const [farm, setFarm] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSeason, setNewSeason] = useState({
    crop: 'Wheat',
    sowingDate: new Date().toISOString().split('T')[0] // Default to today
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const farmRes = await api.get('/farms');
      const foundFarm = farmRes.data.find(f => f.id === farmId);
      setFarm(foundFarm);

      if (foundFarm) {
        const seasonRes = await api.get(`/seasons/${farmId}`);
        setSeasons(seasonRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [farmId]);

  const handleStartSeason = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/seasons', {
        farmId,
        crop: newSeason.crop,
        sowingDate: newSeason.sowingDate
      });
      // Refresh data to show the new schedule
      await fetchData(); 
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to start season");
    } finally {
      setCreating(false);
    }
  };

  if (loading && !farm) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!farm) return <div className="p-8 text-red-500">Farm not found</div>;

  const activeSeason = seasons.find(s => s.status === 'ACTIVE');

  return (
    <div className="relative">
      {/* Header */}
      <button onClick={() => navigate('/farms')} className="flex items-center text-gray-500 mb-4 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Farms
      </button>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-earth-800">{farm.name}</h1>
            <p className="text-gray-500">{farm.district}, {farm.state} • {farm.landSize} Acres</p>
          </div>
          <div className="text-right text-sm">
             <span className="block text-gray-400">Soil: <span className="text-gray-700 capitalize">{farm.soilType.toLowerCase()}</span></span>
             <span className="block text-gray-400">Water: <span className="text-gray-700 capitalize">{farm.irrigationType?.toLowerCase().replace('_', ' ')}</span></span>
          </div>
        </div>
      </div>

      {/* Season Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-earth-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Current Season
        </h2>
        {/* Only show "New Season" button if NO active season exists */}
        {!activeSeason && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-semibold text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg transition-colors"
          >
            + Start Season manually
          </button>
        )}
      </div>

      {!activeSeason ? (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 text-center">
          <Sprout className="w-12 h-12 text-orange-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-orange-800">No Active Season</h3>
          <p className="text-orange-600 mb-4">Start a crop cycle to generate your schedule.</p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary mx-auto bg-orange-600 hover:bg-orange-700"
          >
            Start New Season
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Season Card */}
          <div className="bg-primary-50 border border-primary-100 p-6 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-primary-600 font-bold uppercase tracking-wider">Active Crop</p>
              <h3 className="text-3xl font-bold text-primary-800">{activeSeason.crop}</h3>
              <p className="text-primary-700 mt-1">Sown on: {new Date(activeSeason.sowingDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">Day {Math.floor((new Date() - new Date(activeSeason.sowingDate)) / (1000 * 60 * 60 * 24))}</p>
              <p className="text-primary-600 text-sm">of Cycle</p>
            </div>
          </div>

          {/* Task Timeline */}
          <div>
             <h3 className="font-semibold text-gray-700 mb-4">Recommended Schedule</h3>
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {activeSeason.tasks?.map((task) => (
                 <div key={task.id} className="p-4 border-b border-gray-100 last:border-0 flex gap-4 hover:bg-gray-50 transition-colors">
                   <div className="mt-1">
                     {task.isCompleted ? (
                       <CheckCircle className="w-6 h-6 text-green-500" />
                     ) : (
                       <Circle className="w-6 h-6 text-gray-300" />
                     )}
                   </div>
                   <div>
                     <h4 className={`font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                       {task.title}
                     </h4>
                     <p className="text-sm text-gray-500">{task.description}</p>
                     <p className="text-xs text-primary-600 font-medium mt-1">
                       Due: {new Date(task.dueDate).toLocaleDateString()}
                     </p>
                   </div>
                 </div>
               ))}
               {activeSeason.tasks?.length === 0 && (
                 <div className="p-4 text-center text-gray-400">No tasks generated yet.</div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* START SEASON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-earth-800">Start New Season</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStartSeason} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
                <select 
                  className="input-field bg-white"
                  value={newSeason.crop}
                  onChange={(e) => setNewSeason({...newSeason, crop: e.target.value})}
                >
                  <option value="Wheat">Wheat (Rabi)</option>
                  <option value="Rice">Rice / Paddy (Kharif)</option>
                  <option value="Corn">Corn / Maize</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={newSeason.sowingDate}
                  onChange={(e) => setNewSeason({...newSeason, sowingDate: e.target.value})}
                  required
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-700">
                  This will generate a strict schedule of <strong>Irrigation</strong> and <strong>Fertilizers</strong> based on your sowing date.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={creating}
                  className="w-full btn-primary py-3"
                >
                  {creating ? <Loader2 className="animate-spin" /> : "Start Season & Generate Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}