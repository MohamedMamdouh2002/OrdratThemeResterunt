'use client'
import React, { useEffect, useRef, useState } from 'react';
import Title from '../ui/title/Title'
import Image from 'next/image'
import SmallCard from '../ui/smallCard/SmallCard'
import MediumCard from '../ui/mediumCard/MediumCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useUserContext } from '../context/UserContext'
import Card from '../ui/card/Card'
import { AllCategories, Food, PaginatedAllCategories } from '@/types'
import { Swiper as SwiperType } from 'swiper';
import PrevArrow from '../PrevArrow'
import NextArrow from '../NextArrow'
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { EmptyProductBoxIcon } from 'rizzui';
import CustomImage from '../ui/CustomImage';
import { Loader } from 'lucide-react';
import { shopId } from '@/config/shopId';

type Props = { data?: PaginatedAllCategories; initialCategory?: string };
type FakeData = {
  maximumFakeViewers: number;
  minimumFakeViewers: number;
  isFakeViewersAvailable:boolean;
  isFakeSoldNumberAvailable:boolean;
  maximumFakeSoldNumber:number;
  minimumFakeSoldNumber:number;
  lastSoldNumberInHours:number;

};
function Grills({ lang, ProductData, HomeData }: { lang: string; ProductData?: any; HomeData?: any[] }) {
  const { GetHome } = useUserContext();
  const [home, setHome] = useState<any[]>([])
  const { t } = useTranslation(lang!, 'home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRefs = useRef<{ [key: string]: SwiperType | null }>({});
  const [fakeData, setFakeData] = useState<FakeData | null>(null);
 const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchedPages = useRef<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(40); // عدد العناصر في كل صفحة
  const [hasMore, setHasMore] = useState(true)
  
  useEffect(() => {
    const fetchPaginatedData = async () => {
      if (!hasMore) return;
  
      setLoading(true);
      const data:any = await GetHome({ lang, page,pageSize });
  
      if (data?.entities?.length  as any > 0) {
        setHome((prev) => [
          ...prev,
          ...(data?.entities ?? []).filter((entity: any) => !prev.some((e: any) => e.id === entity.id))
        ]);
        
        if (data?.nextPage > page) {
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      setLoading(false);
    };
  
    fetchPaginatedData();
  }, [page, lang]);
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
  

  useEffect(() => {
    const fetchFakeData = async () => {
      try {
        const response = await fetch(`https://testapi.ordrat.com/api/FakeData/GetFakeDataByShopId/${shopId}`);
        if (!response.ok) throw new Error('Failed to fetch fake data');
  
        const result: FakeData = await response.json();
        setFakeData(result); // حطينا الريسبونس في الستيت مباشرة
      } catch (error) {
        console.error('Error fetching fake data:', error);
      }
    };
  
    fetchFakeData();
  }, [shopId]);
  return <>
    <div className="mb-10">
      {home?.filter((sec) => sec.isActive).length === 0 ? (
        <div className="w-5/6 m-auto my-10">
          <div className="flex flex-col justify-center items-center">
            <EmptyProductBoxIcon />
            <p>{lang === 'ar' ? 'لا يوجد منتجات' : 'No products found'}</p>
          </div>
        </div>
      ) : (
        home
          ?.filter((sec) => sec.isActive)
          .sort((a, b) => a.priority - b.priority)
          .map((sec) => (
            <div key={sec.id} id={sec.id} className="w-5/6 sm:w-[90%] mx-auto mt-20">
              <div className="flex justify-between items-center">
                <Title title={sec.name} />
                {sec.hasMoreProducts &&
                  <Link href={`/${lang}/category/${sec.id}`}>
                    <p className="hover:text-mainColor mb-5 text-black font-medium text-lg underline">
                      {t('view-all')}
                    </p>
                  </Link>
                }

              </div>

              {sec.numberOfColumns !== 0 &&
                sec.numberOfColumns !== 2 &&
                sec.numberOfColumns !== 1 && (
                  <div className="relative">
                    <CustomImage
                      id="offers"
                      src={sec?.bannerUrl}
                      width={900}
                      height={300}
                      className="w-full h-[240px] sm:h-[300px] object-cover -mb-28 relative rounded-lg"
                      alt=""
                    />
                    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-white"></div>
                  </div>
                )}

              {sec.products.length === 0 ? (
                <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-lg my-6">
                  {/* <EmptyProductBoxIcon className='text-gray-100 bg-gray-100 mx-auto w-40' /> */}
                  <p className='text-lg font-medium'>{lang === 'ar' ? 'لا يوجد منتجات' : 'No products found'}</p>
                </div>
              ) : (
                <div
                  className={
                    sec.numberOfColumns === 1
                      ? `grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 sm:gap-5`
                      : sec.numberOfColumns === 2
                        ? 'grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5'
                        : 'sm:gap-4 gap-2'
                  }
                >
                  {sec.numberOfColumns === 3 ? (
                    <div className="relative">
                      {(swiperRefs.current[sec.id]?.activeIndex || 0) > 0 && (
                        <div className="absolute top-[50%] start-0 z-10">
                          <PrevArrow
                            lang={lang}
                            onClick={() => swiperRefs.current[sec.id]?.slidePrev()}
                          />
                        </div>
                      )}
                      {(swiperRefs.current[sec.id]?.activeIndex || 0) <
                        sec.products.length - 6 && (
                          <div className="absolute top-[50%] end-4 z-10">
                            <NextArrow
                              lang={lang}
                              onClick={() => swiperRefs.current[sec.id]?.slideNext()}
                            />
                          </div>
                        )}
                      <Swiper
                        spaceBetween={28}
                        slidesPerView={6}
                        onSwiper={(swiper) =>
                          (swiperRefs.current[sec.id] = swiper)
                        }
                        onSlideChange={(swiper) =>
                          setCurrentSlide(swiper.activeIndex)
                        }
                        breakpoints={{
                          0: { slidesPerView: 2.5, slidesPerGroup: 1 },
                          500: { slidesPerView: 3.6, slidesPerGroup: 1 },
                          640: { slidesPerView: 4.3, slidesPerGroup: 1 },
                          768: { slidesPerView: 4.3, slidesPerGroup: 1 },
                          840: { slidesPerView: 4.7, slidesPerGroup: 1 },
                          1024: { slidesPerView: 4.3, slidesPerGroup: 1 },
                          1280: { slidesPerView: 6, slidesPerGroup: 1 },
                          2500: { slidesPerView: 8, slidesPerGroup: 1 },
                        }}
                      >
                        {sec.products.map((prod: React.JSX.IntrinsicAttributes & Food & { setCurrentItem: React.Dispatch<React.SetStateAction<{ type?: string; id: string } | null>> }) => (
                          <SwiperSlide key={prod.id}>
                            <SmallCard FakeData={fakeData} ProductData={home} lang={lang} {...prod} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  ) : (
                    sec?.products?.map((prod: React.JSX.IntrinsicAttributes & Food & { setCurrentItem: React.Dispatch<React.SetStateAction<{ type?: string; id: string } | null>> }) =>
                      sec.numberOfColumns === 1 ? (
                        <div key={prod.id}>
                          <MediumCard FakeData={fakeData} ProductData={home} lang={lang} {...prod} />
                          <hr className="mt-1 sm:hidden" />
                        </div>
                      ) : (
                        <Card FakeData={fakeData} ProductData={home} lang={lang} key={prod.id} {...prod} />
                      )
                    )
                  )}
                </div>
              )}
            </div>
          ))
      )}
    </div>
     <div className="flex justify-center">
            {loading && <Loader className="animate-spin text-mainColor" />}
          </div>
          <div ref={observerRef} className="h-1" />
  </>

  
}
export default Grills;