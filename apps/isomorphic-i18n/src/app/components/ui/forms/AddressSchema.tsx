import { SessionContext } from '@/utils/fetch/contexts';
import { useContext } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';
const useAddressValidation = ({lang}:{lang:string}) => {
	const { session } = useContext(SessionContext);
	const arabicToEnglishDigits = (input: string) => {
  return input.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};
	const AdressValidation = yup.object({
		lat: yup.number().required(),
		lng: yup.number().required(lang==='ar'?'هذا الحقل مطلوب':'This field is required'),
		type: yup.string().required(lang==='ar'?'هذا الحقل مطلوب':'This field is required'),
		aptNo: yup
  .string()
  .transform((value) => arabicToEnglishDigits(value || ''))
  .matches(/^[0-9]+$/, lang === 'ar' ? 'يجب أن يكون رقم فقط' : 'Must be a number')
  .required(lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'),

  floor: yup
    .string()
    .required(lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'),

		street: yup
			.string()
			.required(lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'),
		additionalDirections: yup.string().optional(),
		// phoneNumber: yup
		// 	.string()
		// 	.required('phoneRequired')
		// 	.test('validate phone number', 'phoneInvalid', value => {
		// 		if (value && value !== '') return isValidPhoneNumber(value);
		// 		return value === undefined;
		// 	})
	});
	const result = [
		AdressValidation,
		{
			lat: undefined,
			lng: undefined,
			type: '',
			aptNo: '',
			floor: '',
			street: '',
			additionalDirections: undefined,
			phoneNumber: ''
		}
	];
	return result;
};

export default useAddressValidation;
