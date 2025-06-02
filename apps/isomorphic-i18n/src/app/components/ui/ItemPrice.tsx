import React from 'react'
import AddToCartButton from './item/AddToCartButton';
import cn from '@utils/class-names';

// import cn from '../../../../../../../isomorphic/packages/isomorphic-core/src/utils/class-names';

type Props = {
	type?: string;
	action?: () => void;
	price: any;
	oldPrice?: any;
	className?: string;
	buttonType?: "submit" | "reset" | "button" | undefined;
};

function ItemPrice({ type, action, price, oldPrice, className, buttonType }: Props) {
	return (
		<div className="grow">
			<AddToCartButton
				type={type}
				mainItem={true}
				action={action}
				className={`w-full py-2 ${className}`}
				price={price as any}
				oldPrice={oldPrice}
				buttonType={buttonType}
			/>
		</div>
	);
}

export default ItemPrice