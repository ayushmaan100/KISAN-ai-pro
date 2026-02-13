import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sprout, Calendar, CheckCircle, Circle, ArrowLeft, Loader2, X, AlertTriangle, Wallet, TrendingDown, Plus } from 'lucide-react';
import api from '../api';

export default function FarmDetails() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  
  const [farm, setFarm] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'financials'
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Data
  const [newSeason, setNewSeason] = useState({ crop: 'Wheat', sowingDate: new Date().toISOString().split('T')[0] });
  const [newExpense, setNewExpense] = useState({ category: 'Fertilizer', amount: '', note: '' });

  const activeSeason = seasons.find(s => s.status === 'ACTIVE');

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
        
        // If there is an active season, fetch its expenses
        const current = seasonRes.data.find(s => s.status === 'ACTIVE');
        if (current) {
          const expenseRes = await api.get(`/expenses/${current.id}`);
          setExpenses(expenseRes.data);
        }
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

  // Handlers
  const handleStartSeason = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/seasons', { farmId, ...newSeason });
      await fetchData(); 
      setIsSeasonModalOpen(false);
    } catch (error) {
      alert("Failed to start season");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/expenses', { 
        seasonId: activeSeason.id,
        ...newExpense 
      });
      
      // Refresh expenses only
      const res = await api.get(`/expenses/${activeSeason.id}`);
      setExpenses(res.data);
      
      setIsExpenseModalOpen(false);
      setNewExpense({ category: 'Fertilizer', amount: '', note: '' }); // Reset form
    } catch (error) {
      alert("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (loading && !farm) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!farm) return <div className="p-8 text-red-500">Farm not found</div>;

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

      {!activeSeason ? (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 text-center">
          <Sprout className="w-12 h-12 text-orange-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-orange-800">No Active Season</h3>
          <p className="text-orange-600 mb-4">Start a crop cycle to manage tasks and expenses.</p>
          <button onClick={() => setIsSeasonModalOpen(true)} className="btn-primary mx-auto bg-orange-600 hover:bg-orange-700">
            Start New Season
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Season Banner */}
          <div className="bg-primary-50 border border-primary-100 p-6 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-primary-600 font-bold uppercase tracking-wider">Active Crop</p>
              <h3 className="text-3xl font-bold text-primary-800">{activeSeason.crop}</h3>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">Day {Math.floor((new Date() - new Date(activeSeason.sowingDate)) / (1000 * 60 * 60 * 24))}</p>
              <p className="text-primary-600 text-sm">of Cycle</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'schedule' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Schedule & Tasks
              {activeTab === 'schedule' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('financials')}
              className={`pb-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'financials' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Financials & Expenses
              {activeTab === 'financials' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
            </button>
          </div>

          {/* TAB CONTENT: SCHEDULE */}
          {activeTab === 'schedule' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {activeSeason.tasks?.map((task) => (
                 <div key={task.id} className="p-4 border-b border-gray-100 last:border-0 flex gap-4 hover:bg-gray-50 transition-colors">
                   <div className="mt-1">
                     {task.isCompleted ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-300" />}
                   </div>
                   <div>
                     <h4 className={`font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</h4>
                     <p className="text-sm text-gray-500">{task.description}</p>
                     <p className="text-xs text-primary-600 font-medium mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {/* TAB CONTENT: FINANCIALS */}
          {activeTab === 'financials' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-gray-500 text-sm">Total Spent</p>
                     <p className="text-2xl font-bold text-gray-800">₹{totalCost.toLocaleString()}</p>
                   </div>
                   <div className="bg-red-50 p-3 rounded-lg"><TrendingDown className="w-6 h-6 text-red-600" /></div>
                </div>
                <button 
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="bg-white p-5 rounded-xl border-2 border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                   <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-600 mb-1" />
                   <span className="text-gray-600 font-medium group-hover:text-primary-700">Log New Expense</span>
                </button>
              </div>

              <h3 className="font-semibold text-gray-800 mb-3">Expense History</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {expenses.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No expenses recorded yet.</div>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg"><Wallet className="w-4 h-4 text-gray-600" /></div>
                        <div>
                          <p className="font-medium text-gray-800">{expense.category}</p>
                          <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()} • {expense.note || 'No note'}</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">-₹{expense.amount.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* START SEASON MODAL */}
      {isSeasonModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-earth-800">Start New Season</h3>
              <button onClick={() => setIsSeasonModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleStartSeason} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
                <select className="input-field bg-white" value={newSeason.crop} onChange={(e) => setNewSeason({...newSeason, crop: e.target.value})}>
                  <option value="Wheat">Wheat</option><option value="Rice">Rice</option><option value="Corn">Corn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date</label>
                <input type="date" className="input-field" value={newSeason.sowingDate} onChange={(e) => setNewSeason({...newSeason, sowingDate: e.target.value})} required />
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-primary py-3">{submitting ? <Loader2 className="animate-spin" /> : "Start Season"}</button>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-earth-800">Log Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field bg-white" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" placeholder="0.00" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <input type="text" className="input-field" placeholder="e.g. 50kg Urea" value={newExpense.note} onChange={(e) => setNewExpense({...newExpense, note: e.target.value})} />
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-primary py-3">{submitting ? <Loader2 className="animate-spin" /> : "Save Expense"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}