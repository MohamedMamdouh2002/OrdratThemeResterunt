'use client';
import { useUserContext } from '@/app/components/context/UserContext';
import Card from '@/app/components/ui/card/Card';
import MediumCard from '@/app/components/ui/mediumCard/MediumCard';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import { API_BASE_URL } from '@/config/base-url';
import { Food } from '@/types';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function AllProduct({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const [products, setProducts] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const params = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const { shopId } = useUserContext();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // لتخزين الصفحات التي تم جلبها بالفعل ومنع التكرار في Strict Mode
  const fetchedPages = useRef<Set<number>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      // إذا تم جلب الصفحة مسبقاً، نتخطاها
      if (fetchedPages.current.has(page)) return;
      fetchedPages.current.add(page);

      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Products/GetByCategoryId/${shopId}/${params?.id}?PageNumber=${page}&PageSize=4`,
          {
            headers: {
              'Accept-Language': lang!,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.entities.length === 0) {
          setHasMore(false);
        } else {
          // التأكد من عدم تكرار المنتجات بناءً على الـ id
          setProducts((prev) => {
            const newEntities = data.entities.filter(
              (entity: Food) => !prev.some((p: Food) => p.id === entity.id)
            );
            // إذا كانت الصفحة الأولى نستبدل القائمة، وإلا نضيف عليها
            return page === 1 ? newEntities : [...prev, ...newEntities];
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchProducts();
    }
  }, [page, shopId, params?.id, lang, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore]);

  return <>
        <ScrollToTop/>
  
    <div className="w-5/6 sm:w-[90%] mx-auto mt-20 mb-10">
    {products.map((prod: Food, index) =>
      <h1 key={index} className='text-center mb-12'>{ index === 0 && prod.categoryName}</h1>
    )}
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
      {products.map((prod: Food, index) => (
        isMobile ?
        <div className="col-span-full" key={prod.id}>
            <MediumCard lang={lang!} setCurrentItem={() => { }} {...prod} />
            {index !== products.length - 1 && <hr />}
          </div>
          :
          <Card lang={lang!} setCurrentItem={() => { }} key={prod.id} {...prod} />
        ))}
    </div>
    <div className="flex justify-center">
      {loading && <Loader className="animate-spin text-mainColor" />}
    </div>
    <div ref={observerRef} className="h-1" />
  </div>
  </>
}
