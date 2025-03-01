'use client';
import { useUserContext } from '@/app/components/context/UserContext';
import Card from '@/app/components/ui/card/Card';
import MediumCard from '@/app/components/ui/mediumCard/MediumCard'; 
import { API_BASE_URL } from '@/config/base-url';
// import { shopId } from '@/config/shopId';
import { Food } from '@/types';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive'; 
export default function AllProduct({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}){ 
  const [products, setProducts] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const params = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const { shopId } = useUserContext();

  // ref لمراقبة الوصول إلى نهاية القائمة
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); 
      try {
        const response = await fetch(`${API_BASE_URL}/api/Products/GetByCategoryId/${shopId}/${params.id}?PageNumber=${page}&PageSize=4`, {
          headers: {
            // accept: '*/*',
            'Accept-Language': lang!,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.entities.length === 0) {
          setHasMore(false);
        } else {
          setProducts(prev => [...prev, ...data.entities]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false); 
      }
    };

    if (hasMore) { 
      fetchProducts();
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 1 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <>
      <div className="w-5/6 sm:w-[90%] mx-auto mt-20 mb-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
          {products.map((prod: Food,index) => (
            isMobile ? 
            <div className="col-span-full" key={prod.id}>
              <MediumCard lang={lang!} setCurrentItem={() => {}} {...prod} /> 
              {index !== products.length - 1 && <hr />}
            </div>
            :
             <Card lang={lang!} setCurrentItem={() => {}} key={prod.id} {...prod} />
          ))}
        </div>
        <div className="flex justify-center">
          {loading && <Loader className="animate-spin text-mainColor" />}
        </div>
        {/* عنصر وهمي لمراقبة الوصول إلى نهاية القائمة */}
        <div ref={observerRef} className="h-1" />
      </div>
    </>
  );
}
