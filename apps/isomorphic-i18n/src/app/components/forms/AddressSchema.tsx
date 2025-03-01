// import { SessionContext } from '@/utils/contexts';
// import { useTranslations } from 'next-intl';
// import { useContext } from 'react';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import * as yup from 'yup';
// const useAddressValidation = () => {
// 	const translated = useTranslations('address');
// 	const { session } = useContext(SessionContext);
// 	const AdressValidation = yup.object({
// 		lat: yup.number().required(translated('latRequired')),
// 		lng: yup.number().required(translated('longRequired')),
// 		type: yup.string().required(translated('typeRequired')),
// 		aptNo: yup.string().required(translated('aptNoRequired')),
// 		floor: yup.number().optional(),
// 		street: yup.string().required(translated('streetRequired')),
// 		additionalDirections: yup.string().optional(),
// 		phoneNumber: yup
// 			.string()
// 			.required(translated('phoneRequired'))
// 			.test('validate phone number', translated('phoneInvalid'), value => {
// 				if (value && value !== '') return isValidPhoneNumber(value);
// 				return value === undefined;
// 			})
// 	});
// 	const result = [
// 		AdressValidation,
// 		{
// 			lat: undefined,
// 			lng: undefined,
// 			type: '',
// 			aptNo: '',
// 			floor: undefined,
// 			street: '',
// 			additionalDirections: undefined,
// 			phoneNumber: ''
// 		}
// 	];
// 	return result;
// };

// export default useAddressValidation;
