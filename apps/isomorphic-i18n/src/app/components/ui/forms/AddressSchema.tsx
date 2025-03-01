import { SessionContext } from '@/utils/fetch/contexts';
import { useContext } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';
const useAddressValidation = () => {
	const { session } = useContext(SessionContext);
	const AdressValidation = yup.object({
		lat: yup.number().required('latRequired'),
		lng: yup.number().required('longRequired'),
		type: yup.string().required('typeRequired'),
		aptNo: yup.number().required('aptNoRequired'),
		floor: yup.string().required('floorRequired'),
		street: yup.string().required('streetRequired'),
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
