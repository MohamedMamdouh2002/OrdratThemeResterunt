import cn from '@utils/class-names';
import { Search } from 'lucide-react';
import React, { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { useTranslation } from '@/app/i18n/client';

type Props = {
	isTop: boolean;
	value?: string;
	handleInputChange?: ChangeEventHandler<HTMLInputElement>;
	handleKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	lang?:string;
};

function SearchInput({ isTop, value, handleInputChange, handleKeyDown, lang }: Props) {
	const { t } = useTranslation(lang!, 'search');
	return (
		<div className="flex gap-3 items-center w-80 py-3 px-2 border rounded-lg">
			<Search
				className={cn('text-black/50', {
					'text-white/90 border-white/90': !isTop
				})}
			/>
			<input
				value={value}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				type="search"
				className={cn('w-full bg-transparent border-none rounded-none p-0 text-base leading-normal shadow-none focus-within:outline-none focus:ring-0 focus:border-none placeholder:text-black/50 ', {
					'placeholder:text-white/90': !isTop
				})}
				placeholder={t('placeholder')}
			/>
		</div>
	);
}

export default SearchInput;
