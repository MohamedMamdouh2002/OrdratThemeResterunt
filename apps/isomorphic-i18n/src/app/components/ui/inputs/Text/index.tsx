import React from 'react';
import FormikInput from '../../hoc/layout/FormikInput';
import cn from '@utils/class-names';

export default function Text({
	name,
	label,
	placeholder,
	disabled,
	...props
}: {
	name: string;
	label: string;
	placeholder?: string;
	IsTextarea?: boolean;
	min?: string;
	type?: string;
	required?: boolean;
	autoComplete?: string;
	disabled?: boolean;
	props?: any[];
}) {
	return (
		<FormikInput
			name={name}
			label={label}
			placeholder={placeholder}
			InputComponent={TextInput}
			disabled={disabled}
			{...props}
		/>
	);
}

const TextInput = ({
	id,
	value,
	placeholder,
	handleOnChange,
	handleOnBlur,
	IsTextarea = false,
	inputClasses,
	disabled,
	...props
}: {
	id: string;
	value: string;
	placeholder?: string;
	handleOnChange: (val: string) => void;
	handleOnBlur: () => void;
	IsTextarea: boolean;
	inputClasses?: string;
	disabled?: boolean;
	props?: any[];
}) => {
	return IsTextarea ? (
		<textarea
			value={value}
			id={id}
			placeholder={placeholder}
			onChange={e => handleOnChange(e.target.value)}
			onBlur={handleOnBlur}
			disabled={disabled}
			className={cn(
				'w-full p-3 rounded-lg outline-0 min-h-[140px] resize-none border border-[rgb(227,227,227,1)] px-3 py-2 focus-within:border-dotted focus-within:border-mainColor focus-within:outline-none disabled:text-stone-400 focus:border-mainColor focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-0',
				inputClasses
			)}
			{...props}
		/>
	) : (
		<input
			value={value}
			id={id}
			placeholder={placeholder}
			onChange={e => handleOnChange(e.target.value)}
			onBlur={handleOnBlur}
			disabled={disabled}
			className={cn(
				'w-full p-3 rounded-lg outline-0 border border-[rgb(227,227,227,1)] px-3 py-2 focus-within:border-dotted focus-within:border-mainColor focus-within:outline-none disabled:text-stone-400 focus:border-mainColor focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-0',
				inputClasses
			)}
			{...props}
		/>
	);
};
