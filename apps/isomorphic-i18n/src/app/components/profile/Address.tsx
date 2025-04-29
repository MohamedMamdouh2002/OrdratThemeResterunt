import cn from '@utils/class-names';
import { BriefcaseBusiness, Building, Home } from 'lucide-react';
import React from 'react';

type Props = { address: Address; className?: string };

function Address({ address, className }: Props) {
	return (
		<div className={cn('flex flex-col gap-2 max-w-full', className)}>
			<span className={`px-3 py-2 rounded-lg transition duration-150 flex items-center gap-2 max-w-full`}>
				{address.type === 0 ? (
					<Building className="pt-1 text-mainColor" />
				) : address.type === 1 ? (
					<Home className="pt-1 text-mainColor" />
				) : (
					<BriefcaseBusiness className="pt-1 text-mainColor" />
				)}
				<span className='whitespace-nowrap overflow-hidden truncate max-w-[250px] xs:max-w-[140px] sm:max-w-[80%]'>
					{address.aptNo}, {address.floor ? address.floor + ', ' : ''}
					{address.street}
				</span>
			</span>
			<p className="px-6 text-black/50 text-sm font-bold whitespace-nowrap overflow-hidden truncate max-w-full">
					{address.phoneNumber}
				<br />
					{address.additionalDirections}
			</p>
		</div>
	);
}

export default Address;
