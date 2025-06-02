import cn from '@utils/class-names';
import React from 'react';

type Props = {
	oldPrice?: string;
	price: any;
	className?: string;
	PriceClassName?: string;
	oldPriceClassName?: string;
};

function Price({ price, oldPrice, className, PriceClassName, oldPriceClassName }: Props) {
	return (
		<div className={cn('flex', className)}>
			<bdi
				className={cn(
					' bg-white px-2 py-1 rounded-md ',
					{
						'text-red-400 ': oldPrice
					},
					PriceClassName
				)}
			>
				{price}
			</bdi>
			{oldPrice && (
				<span className={cn(' line-through text-xs  bg-white text-mainColor rounded-md ', oldPriceClassName)}>
					{oldPrice}
				</span>
			)}
		</div>
	);
}

export default Price;
