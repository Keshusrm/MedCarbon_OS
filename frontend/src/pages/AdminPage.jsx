import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Users, Database, Plus, Edit2, Trash2, 
  ChevronLeft, ChevronRight, RefreshCw, X, ShieldAlert 
} from 'lucide-react';
import { API_BASE } from '../config';


export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dataset'); // 'dataset' or 'users'
  
  // States for Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null means creating, otherwise user object
  const [userForm, setUserForm] = useState({
    email: '', password: '', fullName: '', role: 'onboard_cso', 
    institution: '', address: '', facilityName: '', department: 'Operations & Facilities'
  });

  // States for Dataset
  const [datasetRows, setDatasetRows] = useState([]);
  const [datasetColumns, setDatasetColumns] = useState([]);
  const [datasetTotal, setDatasetTotal] = useState(0);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [datasetPage, setDatasetPage] = useState(1);
  const datasetLimit = 15;
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null); // null means creating, otherwise row index
  const [datasetForm, setDatasetForm] = useState({
    date_time: '', electricity_facility: 0.0, fans_electricity: 0.0,
    cooling_electricity: 0.0, heating_electricity: 0, interior_lights_electricity: 0.0,
    interior_equipment_electricity: 0.0, gas_facility: 0.0, heating_gas: 0.0,
    interior_equipment_gas: 0.0, water_heater_gas: 0.0
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // ── Fetch Users ────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Fetch Dataset ──────────────────────────────────────────────────────────
  const fetchDataset = async (page = 1) => {
    setDatasetLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/dataset?page=${page}&limit=${datasetLimit}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch dataset');
      const data = await res.json();
      setDatasetRows(data.rows);
      setDatasetColumns(data.columns);
      setDatasetTotal(data.total);
      setDatasetPage(page);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setDatasetLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchDataset(datasetPage);
    }
  }, [activeTab]);

  // ── User Submit (Create/Update) ────────────────────────────────────────────
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = editingUser !== null;
      const url = isEditing 
        ? `${API_BASE}/api/admin/users/${editingUser.id}` 
        : `${API_BASE}/api/admin/users`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = isEditing 
        ? {
            full_name: userForm.fullName,
            role: userForm.role,
            institution: userForm.institution,
            address: userForm.address,
            facility_name: userForm.facilityName,
            department: userForm.department,
            password: userForm.password || undefined // only update password if entered
          }
        : {
            email: userForm.email,
            password: userForm.password,
            full_name: userForm.fullName,
            role: userForm.role,
            institution: userForm.institution,
            address: userForm.address,
            facility_name: userForm.facilityName,
            department: userForm.department
          };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save user');
      
      showNotification(isEditing ? 'User updated successfully' : 'User created successfully');
      setUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // ── Delete User ────────────────────────────────────────────────────────────
  const handleUserDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete user');
      showNotification('User deleted successfully');
      fetchUsers();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // ── Open Edit User Modal ───────────────────────────────────────────────────
  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: '', // blank by default for editing
      fullName: user.full_name || '',
      role: user.role || 'onboard_cso',
      institution: user.institution || '',
      address: user.address || '',
      facilityName: user.facility_name || '',
      department: user.department || 'Operations & Facilities'
    });
    setUserModalOpen(true);
  };

  // ── Open Create User Modal ─────────────────────────────────────────────────
  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      email: '', password: '', fullName: '', role: 'onboard_cso',
      institution: '', address: '', facilityName: '', department: 'Operations & Facilities'
    });
    setUserModalOpen(true);
  };

  // ── Dataset Submit (Create/Update) ─────────────────────────────────────────
  const handleDatasetSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = editingRowIndex !== null;
      const url = isEditing 
        ? `${API_BASE}/api/admin/dataset/row/${editingRowIndex}` 
        : `${API_BASE}/api/admin/dataset/row`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(datasetForm)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save dataset row');

      showNotification(isEditing ? 'Row updated successfully. Retraining started!' : 'Row appended successfully. Retraining started!');
      setDatasetModalOpen(false);
      fetchDataset(datasetPage);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // ── Delete Dataset Row ─────────────────────────────────────────────────────
  const handleDatasetDelete = async (rowIndex) => {
    if (!confirm('Are you sure you want to delete this row from the dataset? This will trigger model retraining.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/dataset/row/${rowIndex}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete row');
      showNotification('Row deleted successfully. Retraining started!');
      fetchDataset(datasetPage);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // ── Open Edit Dataset Modal ────────────────────────────────────────────────
  const openEditDataset = (row) => {
    setEditingRowIndex(row._index);
    setDatasetForm({
      date_time: row['Date/Time'] || '',
      electricity_facility: parseFloat(row['Electricity:Facility [kW](Hourly)'] || 0.0),
      fans_electricity: parseFloat(row['Fans:Electricity [kW](Hourly)'] || 0.0),
      cooling_electricity: parseFloat(row['Cooling:Electricity [kW](Hourly)'] || 0.0),
      heating_electricity: parseInt(row['Heating:Electricity [kW](Hourly)'] || 0),
      interior_lights_electricity: parseFloat(row['InteriorLights:Electricity [kW](Hourly)'] || 0.0),
      interior_equipment_electricity: parseFloat(row['InteriorEquipment:Electricity [kW](Hourly)'] || 0.0),
      gas_facility: parseFloat(row['Gas:Facility [kW](Hourly)'] || 0.0),
      heating_gas: parseFloat(row['Heating:Gas [kW](Hourly)'] || 0.0),
      interior_equipment_gas: parseFloat(row['InteriorEquipment:Gas [kW](Hourly)'] || 0.0),
      water_heater_gas: parseFloat(row['Water Heater:WaterSystems:Gas [kW](Hourly)'] || 0.0)
    });
    setDatasetModalOpen(true);
  };

  // ── Open Create Dataset Modal ──────────────────────────────────────────────
  const openCreateDataset = () => {
    setEditingRowIndex(null);
    setDatasetForm({
      date_time: ' 01/01  01:00:00', // standard format placeholder
      electricity_facility: 900.0, fans_electricity: 100.0,
      cooling_electricity: 500.0, heating_electricity: 0, interior_lights_electricity: 35.0,
      interior_equipment_electricity: 110.0, gas_facility: 550.0, heating_gas: 540.0,
      interior_equipment_gas: 5.0, water_heater_gas: 8.0
    });
    setDatasetModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-navy-800 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-red-500" />
              Administrative Control Console
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Direct administrative database tools to manage SQLite users and model training spreadsheet datasets.
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => activeTab === 'users' ? fetchUsers() : fetchDataset(datasetPage)}
              className="p-2.5 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors"
              title="Refresh Current Panel"
            >
              <RefreshCw size={18} className={(usersLoading || datasetLoading) ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => activeTab === 'users' ? openCreateUser() : openCreateDataset()}
              className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              {activeTab === 'users' ? 'Add User' : 'Add Data Row'}
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification.message && (
          <div className={`p-4 rounded-xl text-sm font-semibold border shadow-sm transition-all duration-300 animate-slide-up ${
            notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Console Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-navy-800 gap-2">
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'dataset'
                ? 'border-cobalt-500 text-cobalt-500 dark:text-cobalt-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Database size={16} />
            Spreadsheet Dataset ({datasetTotal} rows)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-cobalt-500 text-cobalt-500 dark:text-cobalt-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users size={16} />
            SQLite Users ({users.length})
          </button>
        </div>

        {/* Active Tab Panel */}
        <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'users' ? (
            /* User Panel */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-navy-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Institutional Role</th>
                    <th className="p-4">Institution / Facility</th>
                    <th className="p-4">Registered On</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-navy-800 text-sm">
                  {usersLoading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">Loading user database...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">No users registered in the system database.</td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/40 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{u.full_name || 'N/A'}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="p-4 text-xs font-bold tracking-wider text-cobalt-500 dark:text-cobalt-400 uppercase">{u.role}</td>
                        <td className="p-4">
                          <div className="text-gray-800 dark:text-gray-200">{u.institution || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{u.facility_name || 'N/A'} - {u.department || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-xs text-gray-400">{u.created_at}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditUser(u)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 dark:text-gray-400 rounded transition-colors" title="Edit Credentials">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleUserDelete(u.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded transition-colors" title="Delete User">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Dataset Panel */
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-navy-800 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="p-3">Index</th>
                      <th className="p-3">Date/Time</th>
                      <th className="p-3">Facility Electricity [kW]</th>
                      <th className="p-3">HVAC Fans [kW]</th>
                      <th className="p-3">HVAC Cooling [kW]</th>
                      <th className="p-3">HVAC Heating [kW]</th>
                      <th className="p-3">Interior Lights [kW]</th>
                      <th className="p-3">Interior Equip [kW]</th>
                      <th className="p-3">Gas Facility [kW]</th>
                      <th className="p-3">Gas Heating [kW]</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                    {datasetLoading ? (
                      <tr>
                        <td colSpan="11" className="p-8 text-center text-sm text-gray-400">Loading spreadsheet dataset...</td>
                      </tr>
                    ) : datasetRows.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="p-8 text-center text-sm text-gray-400">Spreadsheet file has no rows.</td>
                      </tr>
                    ) : (
                      datasetRows.map(row => (
                        <tr key={row._index} className="hover:bg-gray-50 dark:hover:bg-navy-800/40 text-gray-700 dark:text-gray-300 transition-colors">
                          <td className="p-3 font-semibold text-gray-400">{row._index}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{row['Date/Time']}</td>
                          <td className="p-3">{row['Electricity:Facility [kW](Hourly)']}</td>
                          <td className="p-3">{row['Fans:Electricity [kW](Hourly)']}</td>
                          <td className="p-3">{row['Cooling:Electricity [kW](Hourly)']}</td>
                          <td className="p-3">{row['Heating:Electricity [kW](Hourly)']}</td>
                          <td className="p-3">{row['InteriorLights:Electricity [kW](Hourly)']}</td>
                          <td className="p-3">{row['InteriorEquipment:Electricity [kW](Hourly)']}</td>
                          <td className="p-3">{row['Gas:Facility [kW](Hourly)']}</td>
                          <td className="p-3">{row['Heating:Gas [kW](Hourly)']}</td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button onClick={() => openEditDataset(row)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 dark:text-gray-400 rounded transition-colors" title="Edit Row">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => handleDatasetDelete(row._index)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded transition-colors" title="Delete Row">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dataset Pagination Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-navy-800 flex justify-between items-center bg-gray-50 dark:bg-navy-950">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing rows <b>{(datasetPage - 1) * datasetLimit}</b> to <b>{Math.min(datasetPage * datasetLimit, datasetTotal)}</b> of <b>{datasetTotal}</b>
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={datasetPage <= 1 || datasetLoading}
                    onClick={() => fetchDataset(datasetPage - 1)}
                    className="p-1.5 border border-gray-200 dark:border-navy-600 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={datasetPage * datasetLimit >= datasetTotal || datasetLoading}
                    onClick={() => fetchDataset(datasetPage + 1)}
                    className="p-1.5 border border-gray-200 dark:border-navy-600 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── User CRUD Dialog Modal ───────────────────────────────────────────── */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-5 border-b border-gray-100 dark:border-navy-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingUser ? 'Edit User Credentials' : 'Add New System User'}
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleUserSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="input-field" placeholder="email@hospital.org" />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  {editingUser ? 'Update Password (leave blank to keep current)' : 'Account Password'}
                </label>
                <input required={!editingUser} type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="input-field" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Full Display Name</label>
                <input required type="text" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} className="input-field" placeholder="Dr. John Doe" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">System Role</label>
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="input-field">
                    <option value="onboard_cso">Chief Sustainability Officer (CSO)</option>
                    <option value="onboard_fm">Facility Manager</option>
                    <option value="onboard_com">Chief of Medicine</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Department</label>
                  <select value={userForm.department} onChange={e => setUserForm({...userForm, department: e.target.value})} className="input-field">
                    <option>Operations & Facilities</option>
                    <option>Clinical Services</option>
                    <option>Procurement & Supply Chain</option>
                    <option>Executive Management</option>
                    <option>Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Hospital Institution</label>
                <input type="text" value={userForm.institution} onChange={e => setUserForm({...userForm, institution: e.target.value})} className="input-field" placeholder="Metro Health System" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Primary Facility</label>
                  <input type="text" value={userForm.facilityName} onChange={e => setUserForm({...userForm, facilityName: e.target.value})} className="input-field" placeholder="Building B" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Address</label>
                  <input type="text" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} className="input-field" placeholder="City, State" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100 dark:border-navy-800">
                <button type="button" onClick={() => setUserModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-navy-600 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dataset CRUD Dialog Modal ────────────────────────────────────────── */}
      {datasetModalOpen && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-5 border-b border-gray-100 dark:border-navy-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingRowIndex !== null ? `Edit Dataset Row ${editingRowIndex}` : 'Append Dataset Row'}
              </h3>
              <button onClick={() => setDatasetModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDatasetSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date/Time (Format: ' MM/DD  HH:MM:SS')</label>
                  <input required type="text" value={datasetForm.date_time} onChange={e => setDatasetForm({...datasetForm, date_time: e.target.value})} className="input-field" placeholder=" 01/01  01:00:00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Electricity: Facility [kW]</label>
                  <input required type="number" step="any" value={datasetForm.electricity_facility} onChange={e => setDatasetForm({...datasetForm, electricity_facility: parseFloat(e.target.value)})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Fans Electricity [kW]</label>
                  <input required type="number" step="any" value={datasetForm.fans_electricity} onChange={e => setDatasetForm({...datasetForm, fans_electricity: parseFloat(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cooling Electricity [kW]</label>
                  <input required type="number" step="any" value={datasetForm.cooling_electricity} onChange={e => setDatasetForm({...datasetForm, cooling_electricity: parseFloat(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Heating Electricity [kW]</label>
                  <input required type="number" value={datasetForm.heating_electricity} onChange={e => setDatasetForm({...datasetForm, heating_electricity: parseInt(e.target.value)})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Interior Lights Elec [kW]</label>
                  <input required type="number" step="any" value={datasetForm.interior_lights_electricity} onChange={e => setDatasetForm({...datasetForm, interior_lights_electricity: parseFloat(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Interior Equip Elec [kW]</label>
                  <input required type="number" step="any" value={datasetForm.interior_equipment_electricity} onChange={e => setDatasetForm({...datasetForm, interior_equipment_electricity: parseFloat(e.target.value)})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Gas Facility [kW]</label>
                  <input required type="number" step="any" value={datasetForm.gas_facility} onChange={e => setDatasetForm({...datasetForm, gas_facility: parseFloat(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Heating Gas [kW]</label>
                  <input required type="number" step="any" value={datasetForm.heating_gas} onChange={e => setDatasetForm({...datasetForm, heating_gas: parseFloat(e.target.value)})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Interior Equip Gas [kW]</label>
                  <input required type="number" step="any" value={datasetForm.interior_equipment_gas} onChange={e => setDatasetForm({...datasetForm, interior_equipment_gas: parseFloat(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Water Heater Gas [kW]</label>
                  <input required type="number" step="any" value={datasetForm.water_heater_gas} onChange={e => setDatasetForm({...datasetForm, water_heater_gas: parseFloat(e.target.value)})} className="input-field" />
                </div>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-400 font-semibold">
                ⚠️ Saving edits will automatically trigger machine learning model retraining in the background. It might take up to 1-2 minutes for predictions and graphs to update completely.
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100 dark:border-navy-800">
                <button type="button" onClick={() => setDatasetModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-navy-600 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">Save Excel Row</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
