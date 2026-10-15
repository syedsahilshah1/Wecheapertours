import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-amber-600 font-serif">404</span>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Destination Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page or ancient path you are looking for has shifted under the desert sands. Let's guide you back.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
