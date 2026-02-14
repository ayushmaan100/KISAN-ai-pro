import React, { useState, useEffect } from 'react';
import { User, Globe, Save, Loader2, LogOut } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', phone: '', language: 'en' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { t, i18n } = useTranslation();


  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: user.name,
        language: user.language
      });
      // Update local storage
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      i18n.changeLanguage(res.data.language); // <--- This switches it instantly
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Update language switcher to use i18n.changeLanguage
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang); // <--- This switches it instantly
    setUser({...user, language: newLang});
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-6">Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Profile Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-lg font-bold text-gray-800">{user.phone}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                value={user.name || ''}
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="input-field pl-10"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select 
                value={i18n.language} // Use current i18n language
                onChange={handleLanguageChange}
                className="input-field pl-10 bg-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                
              </select>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm text-center ${message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>

        {/* Logout Section */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mx-auto">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}