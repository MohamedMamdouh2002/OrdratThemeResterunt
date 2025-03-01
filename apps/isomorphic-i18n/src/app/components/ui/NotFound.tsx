import React from 'react'
import notFound from '../../../../public/assets/notFound.svg';
import Image from 'next/image';

type Props = { name: string };

function NotFound({ name }: Props) {
	return (
		<div className="flex flex-col pt-8 items-center justify-center w-[220px] gap-3 mx-auto">
			<Image src={notFound} alt="not found" width="200" height="200" className='w-full' />
			<p className="text-xl font-semibold capitalize">{name}</p>
		</div>
	);
}

export default NotFound