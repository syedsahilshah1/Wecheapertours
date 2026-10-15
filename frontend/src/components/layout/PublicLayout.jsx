import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import EnquiryModal from '../common/EnquiryModal';

const PublicLayout = () => {
  const [globalModalOpen, setGlobalModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcfbfa]">
      <Header onOpenEnquiry={() => setGlobalModalOpen(true)} />
      
      <main className="flex-1">
        <Outlet context={{ openEnquiry: () => setGlobalModalOpen(true) }} />
      </main>

      <Footer />
      <WhatsAppButton />

      <EnquiryModal
        isOpen={globalModalOpen}
        onClose={() => setGlobalModalOpen(false)}
        initialData={{ defaultMessage: 'Hello, I would like to enquire about traveling to Egypt.' }}
      />
    </div>
  );
};

export default PublicLayout;
