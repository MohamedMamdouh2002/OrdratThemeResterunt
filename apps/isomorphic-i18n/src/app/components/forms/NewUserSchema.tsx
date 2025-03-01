import { useTranslation } from '@/app/i18n/client';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';
const useNewUserValidation = ({ lang }: { lang?: string }) => {
	const { t } = useTranslation(lang!, 'loginForm');
	const ContactValidation = yup.object({
		firstName: yup.string().required(t('firstNameRequired')),
		lastName: yup.string().required(t('lastNameRequired')),
		email: yup.string().email(t('emailInvalid')).required(t('emailRequired')),
		password: yup
			.string()
			.required(t('passwordRequired'))
			.matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$@%_&? "]).*/, {
				message: t('passwordInvalid')
			}),
		phoneNumber: yup
			.string()
			.required(t('phoneRequired'))
			.test('validate phone number', t('phoneInvalid'), value => {
				if (value && value !== '') return isValidPhoneNumber(value);
				return value === undefined;
			})
	});
	return ContactValidation;
};

const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	phoneNumber: ''
};

export { useNewUserValidation, initialValues };
