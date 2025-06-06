'use client';
import Image from 'next/image';
import NotFound from '../ui/NotFound';
import kft from '../../../../public/assets/kfc-background.jpg';
import SearchInput from '../ui/SearchInput';
import { useEffect, useState, useRef } from 'react';
import Card from '../ui/card/Card';
// import { shopId } from '@/config/shopId';
import { API_BASE_URL } from '@/config/base-url';
import { Food } from '@/types';
import { useTranslation } from '@/app/i18n/client';
import { Loader } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import CustomImage from '../ui/CustomImage';
type FakeData = {
  maximumFakeViewers: number;
  minimumFakeViewers: number;
  isFakeViewersAvailable: boolean;
  isFakeSoldNumberAvailable: boolean;
  maximumFakeSoldNumber: number;
  minimumFakeSoldNumber: number;
  lastSoldNumberInHours: number;
};
export default function Content({
	lang,
	initialProducts,
	initialSearch,
	shopId,
	currencyName
  }: {
	lang?: string;
	initialProducts: Food[];
	initialSearch?: string;
	shopId: string;
	currencyName: string;
  }) {	  
	const [searchValue, setSearchValue] = useState(initialSearch ?? '');
	const [products, setProducts] = useState<Food[]>(initialProducts);
	const [currentPage, setCurrentPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const { t, i18n } = useTranslation(lang!, 'search');
	const [background, setBackground] = useState<any | null>(null);
  	const [fakeData, setFakeData] = useState<FakeData | null>(null);

  
	useEffect(() => {
	  i18n.changeLanguage(lang);
	  const storedLogo = localStorage.getItem("logoUrl");
	  const background = localStorage.getItem("backgroundUrl");
	  if (storedLogo) {
	
		  setBackground(background)
	  }
	}, [lang, i18n]);
   useEffect(() => {
	  const fetchFakeData = async () => {
		try {
		  const response = await fetch(`https://testapi.ordrat.com/api/FakeData/GetFakeDataByShopId/${shopId}`);
		  if (!response.ok) throw new Error('Failed to fetch fake data');

		  const result: FakeData = await response.json();
		  setFakeData(result); 
		} catch (error) {
		  console.error('Error fetching fake data:', error);
		}
	  };
  
	  fetchFakeData();
	}, [shopId]);
	// const fetchData = async (searchTerm: string, page: number) => {
	// 	if (isLoading || !hasMore) return;
	// 	setIsLoading(true);
	// 	setIsSearching(true); // Set searching state

	// 	try {
	// 		const pageSize = 5;
	// 		const url = searchTerm
	// 			? `${API_BASE_URL}/api/Products/SearchByName/${shopId}?SearchParamter=${searchTerm}&PageNumber=${page}&PageSize=${pageSize}`
	// 			: `${API_BASE_URL}/api/Products/GetAllDetailed/${shopId}?PageNumber=${page}&PageSize=${pageSize}`;

	// 		const response = await fetch(url, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Accept-Language': `${lang}`,
	// 			},
	// 		});

	// 		const result = await response.json();
	// 		if (page === 1) {
	// 			setProducts(result.entities); // If it's the first page, replace products
	// 		} else {
	// 			setProducts((prevProducts) => [...prevProducts, ...result.entities]); // Otherwise append products
	// 		}
	// 		setNextPage(result.nextPage);
	// 		setHasMore(result.nextPage !== 0);
	// 		setTotalPages(5);
	// 		setIsLoading(false);
	// 		setIsSearching(false); // Reset searching state after fetch
	// 	} catch (error) {
	// 		setErrorMessage('Error fetching data');
	// 		setIsLoading(false);
	// 		setIsSearching(false);
	// 	}
	// };
	const fetchData = async (searchTerm: string, page: number) => {
  if (isLoading || !hasMore) return;
  if (page === 1) return; // ممنوع جلب الصفحة الأولى

  setIsLoading(true);
  setIsSearching(true);

  try {
    const pageSize = 5;
    const url = searchTerm
      ? `${API_BASE_URL}/api/Products/SearchByName/${shopId}?SearchParamter=${searchTerm}&PageNumber=${page}&PageSize=${pageSize}`
      : `${API_BASE_URL}/api/Products/GetAllDetailed/${shopId}?PageNumber=${page}&PageSize=${pageSize}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept-Language': `${lang}`,
      },
    });

    const result = await response.json();

    setProducts((prevProducts) => [...prevProducts, ...result.entities]); // دومًا append
    setNextPage(result.nextPage);
    setHasMore(result.nextPage !== 0);
    setTotalPages(result.totalPages ?? 5);
  } catch (error) {
    setErrorMessage('Error fetching data');
  } finally {
    setIsLoading(false);
    setIsSearching(false);
  }
};

	useEffect(() => {
		if (currentPage > 1) {
		  fetchData(searchValue, currentPage);
		}
	  }, [searchValue, currentPage]);
	  
	
	  const handleInputChange = async (e: any) => {
		const value = e.target.value;
		setSearchValue(value);
		setCurrentPage(1);
		setHasMore(true);
		setIsLoading(true);
		setIsSearching(true);
	  
		try {
		  const pageSize = 5;
		  const url = value
			? `${API_BASE_URL}/api/Products/SearchByName/${shopId}?SearchParamter=${value}&PageNumber=1&PageSize=${pageSize}`
			: `${API_BASE_URL}/api/Products/GetAllDetailed/${shopId}?PageNumber=1&PageSize=${pageSize}`;
	  
		  const response = await fetch(url, {
			method: 'GET',
			headers: {
			  'Accept-Language': lang!,
			},
		  });
	  
		  const result = await response.json();
		  setProducts(result.entities);
		  setNextPage(result.nextPage ?? 2);
		  setHasMore(result.nextPage !== 0);
		  setTotalPages(result.totalPages ?? 5);
		} catch (error) {
		  setErrorMessage('Error fetching data');
		} finally {
		  setIsLoading(false);
		  setIsSearching(false);
		}
	  };
	  
	// Infinite Scroll Observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading && hasMore) {
					setCurrentPage((prevPage) => prevPage + 1);
				}
			},
			{
				rootMargin: '200px',
				threshold: 1.0,
			}
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [isLoading, hasMore]);

	return (
		<>
			<div className="flex flex-col gap-5 mobile:gap-10 pb-5 mobile:pb-0 bg-[#fff]">
				<div className="relative">
					<div className='relative h-[25vh]  after:w-full after:h-full after:inset-0 after:absolute after:bg-ColorLitleHover after:backdrop-blur-sm'>
					{background && (

						<CustomImage width={900} height={300} src={background as any ||kft} alt-={`bg`} alt="background" loading="lazy" decoding="async" data-nimg="fill"
							className='!relative object-cover' style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "cover", color: "transparent" }} />
					)}
							</div>
					<div className="absolute bg-white rounded-lg bottom-0 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 translate-y-1/2">
						<SearchInput lang={lang} isTop={true} value={searchValue} handleInputChange={handleInputChange} />
					</div>
				</div>
				<div className="w-[90%] mx-auto flex flex-col gap-1">
					<h3 className="font-semibold text-lg md:text-2xl py-3 sm:py-4 truncate max-w-[30ch]">
						{`${t('result')} ${searchValue ? `${t('for')} ${searchValue}` : ''}`}
					</h3>
					{!isSearching && products.length === 0 ? (
						<div className="flex justify-center">
							<NotFound name={t('not-found')} />
						</div>
					) : (
						<>
							<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 sm:gap-8">
								{products.map((product: any) => (
									<Card
										lang={lang!}
										key={product.id}
										id={product.id}
										isTopSelling={product.isTopSelling}
										isTopRated={product.isTopRated}
										name={product.name}
										price={product.price}
										oldPrice={product.oldPrice}
										ProductData={products}	
										description={product.description}
										imageUrl={product.imageUrl}
										currencyName={currencyName}
										isActive={product.isActive}
										createdAt={product.createdAt}
										lastUpdatedAt={product.lastUpdatedAt}
										isOffer={false}
										FakeData={fakeData}
										{...product}
										setCurrentItem={() => { }}
									/>
								))}
							</div>
							<div ref={observerRef} className="loading-spinner" />
							{isLoading && <div className="flex justify-center w-full my-24 lg:mt-10">
								<Loader className="animate-spin text-mainColor" width={40} height={40} />
							</div>}
						</>
					)}
				</div>
			</div>
		</>
	);
}
