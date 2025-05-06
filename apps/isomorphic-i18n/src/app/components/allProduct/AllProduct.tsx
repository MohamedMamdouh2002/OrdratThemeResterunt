'use client';
import { useUserContext } from '@/app/components/context/UserContext';
import Card from '@/app/components/ui/card/Card';
import CustomImage from '@/app/components/ui/CustomImage';
import MediumCard from '@/app/components/ui/mediumCard/MediumCard';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import { API_BASE_URL } from '@/config/base-url';
import { Food } from '@/types';
import { useIsMounted } from '@hooks/use-is-mounted';
import { Loader } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

type Props = {
  lang: string;
  initialProducts: Food[];
  initialTitle: any;
  initialPage: number;
  categoryId: string;
  currencyAbbreviation: string;
};

export default function AllProduct({
  lang,
  initialProducts,
  initialTitle,
  initialPage,
  categoryId,
  currencyAbbreviation
}: Props) {
  const [products, setProducts] = useState<Food[]>(initialProducts ?? []);
  const [productTitle, setProductsTitle] = useState<any>(initialTitle ?? {});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage + 1);
  const [hasMore, setHasMore] = useState(true);
  const { shopId } = useUserContext();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchedPages = useRef<Set<number>>(new Set([initialPage]));
  useEffect(() => {
    const fetchProducts = async () => {
      if (fetchedPages.current.has(page)) return;
      fetchedPages.current.add(page);

      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Category/GetProductsByCategoryDetailed/${shopId}?categoryId=${categoryId}&PageNumber=${page}&PageSize=4`,
          {
            headers: {
              'Accept-Language': lang,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        if (!data.products || data.products.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => {
            const newEntities = data.products.filter(
              (entity: Food) => !prev.some((p: Food) => p.id === entity.id)
            );
            return [...prev, ...newEntities];
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
  }, [page, categoryId, shopId, lang, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <>
      <ScrollToTop />
      <div className="w-5/6 sm:w-[90%] mx-auto mt-20 mb-10">
        {productTitle?.bannerUrl && (
          <div className="relative mb-24">
            <CustomImage
              id="offers"
              src={productTitle?.bannerUrl}
              width={900}
              height={300}
              className="w-full h-[240px] sm:h-[300px] object-cover  relative rounded-lg"
              alt={productTitle?.name}
            />
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-white">
              <h1 className='text-center mt-36 mb-3 '>{productTitle?.name}</h1>
            </div>
          </div>
        )}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
          {products.map((prod, index) =>
            isMobile ? (
              <div className="col-span-full" key={prod.id}>
                <MediumCard
                  ProductData={products}
                  lang={lang}
                  currencyName={currencyAbbreviation}
                  setCurrentItem={() => { }}
                  {...prod}
                />
                {index !== products.length - 1 && <hr />}
              </div>
            ) : (
              <Card
                ProductData={products}
                lang={lang}
                currencyName={currencyAbbreviation}

                setCurrentItem={() => { }}
                key={prod.id}
                {...prod}
              />
            )
          )}
        </div>
        <div className="flex justify-center">{loading && <Loader className="animate-spin text-mainColor" />}</div>
        <div ref={observerRef} className="h-1" />
      </div>
    </>
  );
}