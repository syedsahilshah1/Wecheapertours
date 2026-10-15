import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminMediaPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState(null);

  const fetchMedia = () => {
    setLoading(true);
    adminApi.getMedia()
      .then((res) => {
        if (res.data.success && res.data.data) {
          setMediaList(res.data.data.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    if (altText) formData.append('alt_text', altText);

    try {
      const res = await adminApi.uploadMedia(formData);
      if (res.data.success) {
        setFile(null);
        setAltText('');
        fetchMedia();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. File must be JPEG, PNG, or WebP under 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    try {
      await adminApi.deleteMedia(id);
      fetchMedia();
    } catch (err) {
      alert('Failed to delete media file.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Media & Image Library</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload and manage photos for Egypt tours, destinations, and rental properties.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif">
          Upload New Image
        </h2>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Image File (JPEG, PNG, WebP &lt; 10MB) *
            </label>
            <input
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alt Text / SEO Description
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Giza Pyramids sunset view"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif">
          Uploaded Media Files
        </h2>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading media files...</p>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No media files uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((m) => (
              <div
                key={m.id}
                className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between"
              >
                <div className="h-32 overflow-hidden bg-slate-200">
                  <img
                    src={m.url}
                    alt={m.alt_text || m.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-2.5 space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-800 truncate" title={m.original_name}>
                    {m.original_name}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {(m.size_bytes / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="p-2 border-t border-slate-100 flex items-center justify-between bg-white">
                  <button
                    onClick={() => handleCopy(m.url, m.id)}
                    className="p-1 text-slate-500 hover:text-amber-700 rounded-md cursor-pointer flex items-center gap-1 text-[10px]"
                    title="Copy Image URL"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === m.id ? 'Copied' : 'URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMediaPage;
