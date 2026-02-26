import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';

export default function Inventory() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newItem, setNewItem] = useState({ name: '', category: 'Fertilizer', quantity: '', unit: 'kg' });

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', newItem);
      fetchInventory();
      setShowModal(false);
      setNewItem({ name: '', category: 'Fertilizer', quantity: '', unit: 'kg' });
    } catch (e) { alert("Failed to add"); }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-earth-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-600" />
          {t('inventory.title')}
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> {t('inventory.add')}
        </button>
      </header>

      {loading ? <Loader2 className="animate-spin mx-auto" /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Empty. Add your first item!</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">{t('inventory.name')}</th>
                  <th className="p-4 font-semibold text-gray-600">{t('inventory.category')}</th>
                  <th className="p-4 font-semibold text-gray-600">{t('inventory.qty')}</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-500 bg-gray-50/50 rounded-lg text-sm">{item.category}</td>
                    <td className="p-4 font-bold text-earth-800">
                      {item.quantity} {item.unit}
                      {item.quantity < 10 && (
                        <span className="ml-2 inline-flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3 mr-1" /> {t('inventory.low_stock')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{t('inventory.add')}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                placeholder={t('inventory.name')} 
                className="input-field" 
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="input-field bg-white"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Machinery">Machinery</option>
                </select>
                <select 
                  className="input-field bg-white"
                  value={newItem.unit}
                  onChange={e => setNewItem({...newItem, unit: e.target.value})}
                >
                  <option value="kg">kg</option>
                  <option value="liters">liters</option>
                  <option value="packets">packets</option>
                  <option value="bags">bags</option>
                </select>
              </div>
              <input 
                type="number" 
                placeholder="Quantity" 
                className="input-field" 
                value={newItem.quantity}
                onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                required 
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-medium">{t('common.cancel')}</button>
                <button type="submit" className="flex-1 btn-primary py-3">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}