import { fetchData } from '@/utils/fetch/fetch';
import cn from '@utils/class-names';
import React from 'react';

type Props = {
	children: React.ReactNode;
	fullLayout?: string;
	currentPage?: string;
	FooterComp?: React.ReactNode;
	locale: string;
	backButtonClassName?: string;
};

async function Layout({
	children,
	fullLayout = 'true',
	currentPage,
	FooterComp,
	locale,
	backButtonClassName
}: Props) {
	const data = await fetchData<AllCategories>({
		link: 'Category/GetAll',
		lang: locale
	});
	console.log(data.message);
	return (
		<div
			className={cn({
				'mobile:pb-32 w-full': !!FooterComp
			})}
		>
			{children}
			{FooterComp && (
				<div className="fixed bottom-0 p-4 z-20 bg-white w-full hidden mobile:flex border">
					{FooterComp}
				</div>
			)}
			{/* <Footer /> */}
		</div>
	);
}

export default Layout;
