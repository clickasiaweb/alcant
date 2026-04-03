import React from 'react';
import InquiryForm from './InquiryForm';

const InquiryModal = ({ isOpen, onClose, productId, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <InquiryForm 
          productId={productId}
          productName={productName}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default InquiryModal;
