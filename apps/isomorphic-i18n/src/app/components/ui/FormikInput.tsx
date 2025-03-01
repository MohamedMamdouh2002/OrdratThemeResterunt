import {cn}  from './cn';
import { useField } from 'formik';
import Image from 'next/image';
import React, { ElementType } from 'react';
import { LazyMotion, domAnimation, m ,AnimatePresence} from 'framer-motion';
import { XOctagon } from 'lucide-react';

/**
 * A custom Formik input component that handles form field rendering, including labels, input components, and error messages.
 *
 * @component
 * @param {Object} props - The props object for the FormikInput component.
 * @param {string} props.name - The name of the field.
 * @param {string} props.label - The label text for the input field.
 * @param {React.ComponentType} props.InputComponent - The custom input component to be rendered.
 * @param {boolean} [props.firstOpt=true] - Flag to render the label before the input component.
 * @param {boolean} [props.lastOpt=true] - Flag to render the error message after the input component.
 * @param {Object} [props.multiple] - Indicates if the input supports multiple values.
 * @param {string} [props.choicename] - The choice name used when multiple values are supported.
 * @param {Object} props - Additional props to be passed to the InputComponent.
 *
 * @returns {React.Element} The rendered FormikInput component.
 *
 * @example
 * <FormikInput
 *   name="email"
 *   label="Email"
 *   InputComponent={CustomInput}
 *   firstOpt={true}
 *   lastOpt={true}
 * />
 */
type Props = {
	name: string;
	label: string;
	subLabel?: string;
	InputComponent: ElementType;
	firstOpt?: boolean;
	lastOpt?: boolean;
	file?: File;
	onChange?: (val?: any) => void;
	required?: boolean;
	containerClasses?: string;
	inputClasses?: string;
	labelClasses?: string;
	multiple?: boolean;
	choicename?: string;
	props?: any[];
};
export default function FormikInput({
	name,
	label,
	subLabel,
	InputComponent,
	firstOpt = true,
	lastOpt = true,
	file,
	onChange,
	containerClasses,
	inputClasses,
	labelClasses,
	required,
	...props
}: Props) {
	const [inputProps, { value, error, touched, initialValue }, { setTouched, setValue }] =
		useField(name);

	return (
		<LazyMotion features={domAnimation}>
			<div className={cn('flex flex-col gap-3 pb-5', containerClasses)}>
				{firstOpt && (
					<>
						<div className="flex items-center">
							<label
								htmlFor={label}
								className={cn(
									'text-header capitalize font-bold text-sm pe-3 basis-auto w-max break-words pointer-events-none',
									labelClasses
								)}
							>
								{label}
								<span>{required ? '*' : ''}</span>
							</label>
						</div>
						{subLabel && (
							<span className="text-[14px] -mt-2 mb-2 text-black/[39%] whitespace-pre-wrap">
								{subLabel}
							</span>
						)}
						<AnimatePresence>
							{error && touched && lastOpt && (
								<m.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 100, height: 100 }}
									exit={{ opacity: 0, height: 0 }}
									className={
										'basis-full text-xs -mt-2 mb-2 self-start flex items-center gap-2 text-[#F24444] font-medium capitalize'
									}
								>
									<XOctagon size={16} className="mt-1" />

									{error}
								</m.div>
							)}
						</AnimatePresence>
					</>
				)}
				<InputComponent
					value={props.multiple && !file ? props.choicename : value}
					inputClasses={inputClasses}
					id={label}
					handleOnChange={(e: any) => {
						setValue(e);
						onChange && onChange();
					}}
					handleOnBlur={setTouched}
					values={props.multiple && !file ? value : undefined}
					initialvalue={initialValue ? initialValue : ''}
					{...props}
				/>
			</div>
		</LazyMotion>
	);
}
