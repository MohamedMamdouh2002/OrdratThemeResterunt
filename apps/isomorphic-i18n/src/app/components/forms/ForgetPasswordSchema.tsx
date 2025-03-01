import { useTranslation } from '@/app/i18n/client';
import * as yup from 'yup';
const useForgetPasswordValidation = ({ lang }: { lang?: string }) => {
	const { t } = useTranslation(lang!, 'loginForm');

	const translated = useTranslation('ForgetPassworddForm');
	const ContactValidation = yup.object({
		email: yup.string().email(t('emailInvalid')).required(t('emailRequired'))
	});
	return ContactValidation;
};

const initialValues = {
	email: ''
};

export { useForgetPasswordValidation, initialValues as forgetPasswordInitialValues };
