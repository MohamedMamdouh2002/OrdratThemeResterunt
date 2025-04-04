'use client';
import React, { useEffect } from 'react';

interface CustomToastProps {
  message: string;
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 2000); 
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 md:end-20 end-16    z-[1000000] bg-Color90 text-white px-4 py-2 rounded-md shadow-md text-sm font-semibold animate-fade-in-out">
      ✅ {message}
    </div>
  );
};

export default CustomToast;
