import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Inbox, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Send,
  Calendar,
  Phone,
  Mail,
  User,
  Plus
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminEnquiriesPage = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiries = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (searchQuery) params.search = searchQuery;

    adminApi.getEnquiries(params)
      .then((res) => {
        if (res.data.success) {
          setEnquiries(res.data.data);
          // If query param id is passed, auto open modal
          if (highlightedId) {
            const found = res.data.data.find((e) => e.id.toString() === highlightedId);
            if (found) openDetail(found.id);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchQuery]);

  const openDetail = (id) => {
    setModalLoading(true);
    adminApi.getEnquiry(id)
      .then((res) => {
        if (res.data.success) {
          setSelectedEnquiry(res.data.data);
        }
      })
      .finally(() => setModalLoading(false));
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedEnquiry) return;
    setUpdatingStatus(true);
    try {
      const res = await adminApi.updateEnquiry(selectedEnquiry.id, { status: newStatus });
      if (res.data.success) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        fetchEnquiries();
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;

    try {
      const res = await adminApi.addEnquiryNote(selectedEnquiry.id, { note: newNote });
      if (res.data.success) {
        setSelectedEnquiry((prev) => ({
          ...prev,
          notes: [res.data.data, ...(prev.notes || [])],
        }));
        setNewNote('');
      }
    } catch (err) {
      alert('Failed to save internal note.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to archive (soft delete) this enquiry?')) return;
    try {
      await adminApi.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert('Failed to delete enquiry.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">New</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">In Progress</span>;
      case 'responded':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Responded</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Closed</span>;
      case 'spam':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Spam</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Customer Enquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer requests, update workflow statuses, and record internal team notes.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, name, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" /> Status:
          </span>
          {['', 'new', 'in_progress', 'responded', 'closed', 'spam'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st ? st.replace('_', ' ').toUpperCase() : 'ALL'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No enquiries match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Phone / WhatsApp</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-amber-900">
                      {enq.reference}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {enq.customer_name}
                    </td>
                    <td className="px-5 py-3">
                      {enq.phone}
                    </td>
                    <td className="px-5 py-3">
                      {enq.listing?.title || enq.category?.name || 'General Inquiry'}
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => openDetail(enq.id)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="Archive"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Manage Drawer Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden space-y-0">
            
            {/* Modal Header */}
            <div className="bg-[#0b1d30] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-bold font-serif font-mono">
                  {selectedEnquiry.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Customer Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Customer</span>
                  <span className="font-bold text-slate-900 block">{selectedEnquiry.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-amber-700 underline block truncate">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone / WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {selectedEnquiry.phone}
                  </a>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Workflow Status</span>
                  <span className="text-slate-500 text-[11px]">Update the state of this customer interaction:</span>
                </div>
                <select
                  value={selectedEnquiry.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed / Resolved</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              {/* Message & Preferences */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Customer Message
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedEnquiry.message || 'No written message.'}
                </div>
              </div>

              {/* Preferences breakdown */}
              {selectedEnquiry.preferences && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Submitted Preferences
                  </h4>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    {Object.entries(selectedEnquiry.preferences).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-100 last:border-0 py-1">
                        <span className="text-slate-500 capitalize">{k.replace('_', ' ')}:</span>
                        <span className="font-medium text-slate-800">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes Thread */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Internal Team Notes & Activity History
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note (e.g. Sent hotel quote via WhatsApp)..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-2">
                  {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                    selectedEnquiry.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">{note.user?.name || 'Admin'}</span>
                          <span>{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700">{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No internal notes added yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEnquiriesPage;
