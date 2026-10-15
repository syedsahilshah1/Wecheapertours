import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  ArrowRight, 
  AlertCircle, 
  MessageCircle,
  FolderTree,
  PlusCircle,
  Eye
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">New</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">In Progress</span>;
      case 'responded':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Responded</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Resolved / Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading admin statistics...</p>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Enquiries', value: stats?.total_enquiries || 0, icon: Inbox, color: 'text-blue-600 bg-blue-50' },
    { label: 'New Enquiries', value: stats?.new_enquiries || 0, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
    { label: 'In Progress', value: stats?.in_progress_enquiries || 0, icon: Clock, color: 'text-purple-600 bg-purple-50' },
    { label: 'Resolved Enquiries', value: stats?.resolved_enquiries || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Published Listings', value: stats?.published_listings || 0, icon: Compass, color: 'text-teal-600 bg-teal-50' },
    { label: 'Active Destinations', value: stats?.published_destinations || 0, icon: MapPin, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time enquiry metrics and published travel content management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/enquiries"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Review Enquiries
          </Link>
          <Link
            to="/admin/tours"
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Manage Listings
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-serif">
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Recent Customer Enquiries
            </h2>
            <p className="text-xs text-slate-500">
              Latest incoming travel requests from visitors.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Service Requested</th>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats?.recent_enquiries && stats.recent_enquiries.length > 0 ? (
                stats.recent_enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-amber-900">
                      {enq.reference}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{enq.customer_name}</span>
                      <span className="text-slate-400 text-[11px] block">{enq.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      {enq.listing?.title || enq.category?.name || 'General Travel Consultation'}
                    </td>
                    <td className="px-6 py-4">
                      {enq.destination?.name || 'Egypt General'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/enquiries?id=${enq.id}`}
                        className="p-1.5 inline-flex items-center gap-1 text-slate-500 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No enquiries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardOverview;
