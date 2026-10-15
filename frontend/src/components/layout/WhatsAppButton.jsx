import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const WhatsAppButton = () => {
  const { getWhatsAppLink } = useSettings();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Pill */}
      {hovered && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-right-2 duration-200">
          <span>Need help planning? Chat with local guide on WhatsApp</span>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getWhatsAppLink('Hello WeCheaperTours, I would like to enquire about travel options in Egypt.')}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative group w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
