import React from 'react';
import PhoneInput, { Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import FormikInput from '../../hoc/layout/FormikInput';

export default function Phone({
	name,
	label,
	placeholder,
	required,
	disabled,
	...props
}: {
	name: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	props?: any[];
}) {
	return (
		<FormikInput
			name={name}
			label={label}
			placeholder={placeholder}
			InputComponent={MyPhoneInput}
			required={required}
			disabled={disabled} // Pass disabled to the component
			{...props}
		/>
	);
}

const MyPhoneInput = ({
	id,
	value,
	placeholder,
	handleOnChange,
	handleOnBlur,
	disabled,
	...props
}: {
	id: string;
	value: string;
	placeholder?: string;
	handleOnChange: (val: Value) => void; // Updated type for onChange
	handleOnBlur: () => void;
	readOnly?: boolean;
	defaultCountry?: 'EG';
	disabled?: boolean;
	props?: any[];
}) => {
	return (
		<PhoneInput
			readOnly={disabled} // Prevent editing
			countryCallingCodeEditable={false}
			className={
				'bg-white w-full p-3 rounded-lg outline-0 border px-3 py-2 hover:border-mainColor focus-within:border-mainColor focus-within:outline-none disabled:text-stone-400'
			}
			defaultCountry={props.defaultCountry || 'EG'}
			value={value}
			numberInputProps={{
				className:
					'w-full bg-transparent border-none rounded-none p-0 text-base leading-normal shadow-none focus-within:outline-none focus:ring-0 focus:border-none placeholder:text-black/50 rtl:text-end',
				placeholder: placeholder,
			}}
			onChange={disabled ? () => {} : handleOnChange} // Provide a no-op function if disabled
			onBlur={handleOnBlur}
			{...props}
		/>
	);
};
