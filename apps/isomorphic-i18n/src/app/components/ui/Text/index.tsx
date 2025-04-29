import FormikInput from '../FormikInput';
import {cn}  from '../cn';
import React from 'react';

export default function Text({
	name,
	label,
	...props
}: {
	name: string;
	label: string;
	IsTextarea?: boolean;
	min?: string;
	type?: string;
	required?: boolean;
	autoComplete?: string;
	props?: any[];
}) {
	return <FormikInput name={name} label={label} InputComponent={TextInput} {...props} />;
}

const TextInput = ({
	id,
	value,
	handleOnChange,
	handleOnBlur,
	IsTextarea = false,
	inputClasses,
	...props
}: {
	id: string;
	value: string;
	handleOnChange: (val: string) => void;
	handleOnBlur: () => void;
	IsTextarea: boolean;
	inputClasses?: string;
	props?: any[];
}) => {
	return IsTextarea ? (
		<textarea
			value={value}
			id={id}
			onChange={e => handleOnChange(e.target.value)}
			onBlur={handleOnBlur}
			className={cn(
				'w-full  p-3 rounded-lg outline-0 min-h-[140px] resize-none border px-3 py-2 focus-within:border-dotted focus-within:border-mainColor  focus-within:outline-none disabled:text-stone-400',
				inputClasses
			)}
			{...props}
		/>
	) : (
		<input
			value={value}
			id={id}
			onChange={e => handleOnChange(e.target.value)}
			onBlur={handleOnBlur}
			className={
				'w-full p-3 rounded-lg outline-0 border px-3 py-2 focus-within:border-dotted focus-within:border-mainColor  focus-within:outline-none disabled:text-stone-400'
			}
			{...props}
		/>
	);
};
