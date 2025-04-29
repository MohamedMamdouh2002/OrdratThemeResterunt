import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductModalSkeleton = ({ lang }: { lang: string }) => {
  return (
    <div className="flex flex-col">
      {/* الصورة */}
      <div className="w-full h-60 relative">
        <Skeleton className="w-full h-full absolute top-0 left-0 rounded-md" />
      </div>

      {/* المحتوى */}
      <div className="px-4 pt-4 pb-20 space-y-4">
        {/* البادجات */}
        <div className="flex gap-2">
          <Skeleton width={80} height={24} />
        </div>

        {/* اسم المنتج والوصف */}
        <h3 className="font-bold text-xl"><Skeleton width={150} /></h3>
        <p className="text-sm text-black/75"><Skeleton count={2} /></p>

        {/* البيانات الوهمية */}
        <div className="space-y-1 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Skeleton circle width={18} height={18} />
            <Skeleton width={200} height={16} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton circle width={18} height={18} />
            <Skeleton width={220} height={16} />
          </div>
        </div>

        {/* الفاريشن */}
        <div>
          <Skeleton width={120} height={20} className="mb-1" />

          {/* خيارات */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center w-20">
              <Skeleton height={60} width={60} />
              <Skeleton width={60} height={16} />
              <Skeleton width={40} height={14} />
            </div>
            <div className="flex flex-col items-center w-20">
              <Skeleton height={60} width={60} />
              <Skeleton width={60} height={16} />
              <Skeleton width={40} height={14} />
            </div>
          </div>
        </div>

        {/* المنتجات ذات الصلة */}
        <div>
          <Skeleton width={140} height={18} />
          <div className="flex gap-4 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col w-24 items-center">
                <Skeleton width={96} height={48} />
                <Skeleton width={60} height={14} />
                <Skeleton width={40} height={12} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center">
        <Skeleton width={100} height={36} />
        <Skeleton width={100} height={36} />
      </div>
    </div>
  );
};

export default ProductModalSkeleton;
