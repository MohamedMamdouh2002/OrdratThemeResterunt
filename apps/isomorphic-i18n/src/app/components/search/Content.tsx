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

export default function Content({lang}: { lang?: string }) {
	const [searchValue, setSearchValue] = useState('');
	const [products, setProducts] = useState<Food[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false); // New state for searching
	const [hasMore, setHasMore] = useState(true);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const { t } = useTranslation(lang!, 'search');
	const { shopId } = useUserContext();

	const fetchData = async (searchTerm: string, page: number) => {
		if (isLoading || !hasMore) return;
		setIsLoading(true);
		setIsSearching(true); // Set searching state

		try {
			const pageSize = 5;
			const url = searchTerm
				? `${API_BASE_URL}/api/Products/SearchByName/${shopId}?SearchParamter=${searchTerm}&PageNumber=${page}&PageSize=${pageSize}`
				: `${API_BASE_URL}/api/Products/GetAll/${shopId}?PageNumber=${page}&PageSize=${pageSize}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept-Language': `${lang}`,
				},
			});

			const result = await response.json();
			if (page === 1) {
				setProducts(result.entities); // If it's the first page, replace products
			} else {
				setProducts((prevProducts) => [...prevProducts, ...result.entities]); // Otherwise append products
			}
			setNextPage(result.nextPage);
			setHasMore(result.nextPage !== 0);
			setTotalPages(5);
			setIsLoading(false);
			setIsSearching(false); // Reset searching state after fetch
		} catch (error) {
			setErrorMessage('Error fetching data');
			setIsLoading(false);
			setIsSearching(false);
		}
	};

	const handleInputChange = (e: any) => {
		setSearchValue(e.target.value);
		setCurrentPage(1);
		setHasMore(true);
	};

	useEffect(() => {
		fetchData(searchValue, currentPage);
	}, [searchValue, currentPage]);

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
						<Image src={kft} alt="background" loading="lazy" decoding="async" data-nimg="fill" 
						className='!relative object-cover' style={{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:"cover", color:"transparent"}} />
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
										description={product.description}
										imageUrl={product.imageUrl}
										isActive={product.isActive}
										createdAt={product.createdAt}
										lastUpdatedAt={product.lastUpdatedAt}
										isOffer={false}
										setCurrentItem={() => {}}
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
