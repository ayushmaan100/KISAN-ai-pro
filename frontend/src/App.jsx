import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import AddFarm from './pages/AddFarm';
import FarmDetails from './pages/FarmDetails';
import Planner from './pages/Planner';
import Settings from './pages/Settings';
import CropDoctor from './pages/CropDoctor';
import Inventory from './pages/Inventory'; // <--- Import Inventory Page


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/farms/add" element={<AddFarm />} />  
          <Route path="/farms/:farmId" element={<FarmDetails />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/doctor" element={<CropDoctor />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}