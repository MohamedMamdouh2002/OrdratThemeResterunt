// import { SessionContext } from '@/utils/contexts';
// import { useTranslations } from 'next-intl';
// import { useContext } from 'react';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import * as yup from 'yup';
// const useUpdateUserValidation = () => {
// 	const translated = useTranslations('newUserForm');
// 	const { session } = useContext(SessionContext);
// 	const UserValidation = yup.object({
// 		firstName: yup.string().required(translated('firstNameRequired')),
// 		lastName: yup.string().required(translated('lastNameRequired')),
// 		phoneNumber: yup
// 			.string()
// 			.required(translated('phoneRequired'))
// 			.test('validate phone number', translated('phoneInvalid'), value => {
// 				if (value && value !== '') return isValidPhoneNumber(value);
// 				return value === undefined;
// 			})
// 	});
// 	const result = [
// 		UserValidation,
// 		{
// 			firstName: session?.firstName || '',
// 			lastName: session?.lastName || '',
// 			phoneNumber: session?.phoneNumber || ''
// 		}
// 	];
// 	return result;
// };

// export default useUpdateUserValidation;

import React from 'react'

function UpdateProfileSchema() {
  return (
	<div>UpdateProfileSchema</div>
  )
}

export default UpdateProfileSchema