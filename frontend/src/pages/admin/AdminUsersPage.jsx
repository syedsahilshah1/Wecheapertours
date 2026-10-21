import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  UserPlus, 
  Clock, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  User, 
  Briefcase, 
  ShoppingBag,
  Mail,
  Phone,
  Lock
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    phone: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    adminApi.getUsers()
      .then((res) => {
        if (res.data.success) {
          const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.data || []);
          setUsers(list);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'manager',
      phone: '',
      is_active: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'customer',
      phone: user.phone || '',
      is_active: user.is_active ?? true,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      setError('Password is required for new accounts.');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser.id, formData);
      } else {
        await adminApi.createUser(formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Role counters
  const counts = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
    customer: users.filter(u => u.role === 'customer').length,
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 uppercase">
            <Briefcase className="w-3 h-3 text-blue-600" />
            Manager
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase">
            <ShoppingBag className="w-3 h-3 text-emerald-600" />
            Customer / Buyer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            User & Role Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage system administrators, operations managers, and customers who place booking orders.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Role Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setRoleFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === 'all' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">All Accounts</div>
          <div className="text-2xl font-bold mt-1 font-mono">{counts.total}</div>
        </button>

        <button
          onClick={() => setRoleFilter('admin')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === 'admin' 
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">Admins</div>
          <div className="text-2xl font-bold mt-1 font-mono">{counts.admin}</div>
        </button>

        <button
          onClick={() => setRoleFilter('manager')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === 'manager' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">Managers</div>
          <div className="text-2xl font-bold mt-1 font-mono">{counts.manager}</div>
        </button>

        <button
          onClick={() => setRoleFilter('customer')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === 'customer' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">Customers / Guests</div>
          <div className="text-2xl font-bold mt-1 font-mono">{counts.customer}</div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-700 focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">All Roles ({counts.total})</option>
            <option value="admin">Admin ({counts.admin})</option>
            <option value="manager">Manager ({counts.manager})</option>
            <option value="customer">Customer ({counts.customer})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading user directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No users match criteria</p>
            <p className="text-xs text-slate-400">Try adjusting your role filter or search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Orders / Activity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const firstLetter = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800' 
                            : u.role === 'manager' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {firstLetter}
                        </div>
                        <div>
                          <span className="block font-semibold text-slate-900">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ID: #{u.id}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-600">
                        {u.email}
                      </td>

                      <td className="px-6 py-4">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {u.phone || <span className="text-slate-300 italic">None</span>}
                      </td>

                      <td className="px-6 py-4">
                        {u.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                            <X className="w-3.5 h-3.5 text-slate-400" />
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {u.role === 'customer' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {u.orders_count || 0} Tour Enquiries
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Staff Access</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {u.id !== 1 && (
                            <button
                              onClick={() => handleDelete(u.id, u.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  {editingUser ? <Edit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-slate-900 font-serif">
                  {editingUser ? 'Edit User Account' : 'Create New User'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe / Sarah Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingUser ? 'New Password (leave blank to keep unchanged)' : 'Account Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 10 ... / +1 ..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    formData.role === 'admin' 
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={() => setFormData({ ...formData, role: 'admin' })}
                      className="hidden"
                    />
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[11px] block">Admin</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    formData.role === 'manager' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="manager"
                      checked={formData.role === 'manager'}
                      onChange={() => setFormData({ ...formData, role: 'manager' })}
                      className="hidden"
                    />
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Manager</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    formData.role === 'customer' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={formData.role === 'customer'}
                      onChange={() => setFormData({ ...formData, role: 'customer' })}
                      className="hidden"
                    />
                    <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">Customer</span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {formData.role === 'admin' && 'Full access to CMS, website settings, and account permissions.'}
                  {formData.role === 'manager' && 'Can manage bookings, tours, rentals, and respond to enquiries.'}
                  {formData.role === 'customer' && 'Registered customer account that books tours and submits enquiries.'}
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700">Account Active</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    formData.is_active ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
