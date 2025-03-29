'use client';
 
import { useEffect } from 'react';
 
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fff0e0] text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">حدث خطأ غير متوقع</h1>
      <p className="text-gray-600 mb-6">نعتذر، هناك مشكلة في تحميل الصفحة.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-mainColor hover:bg-mainColorHover text-white rounded-md"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
