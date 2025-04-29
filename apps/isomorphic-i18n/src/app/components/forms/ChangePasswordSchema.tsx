import { useTranslation } from '@/app/i18n/client';
import * as yup from 'yup';
const useChangePasswordValidation = ({ lang }: { lang?: string }) => {
	const { t } = useTranslation(lang!, 'changePasswordForm');

	const passwordsValidation = yup.object({
		oldPassword: yup
			.string()
			.required(t('oldPasswordRequired'))
			.matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$@%_&? "]).*/, {
				message: t('newPasswordInvalid')
			}),
		newPassword: yup
			.string()
			.required(t('newPasswordRequired'))
			.matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$@%_&? "]).*/, {
				message: t('newPasswordInvalid')
			})
	});
	const result = [
		passwordsValidation,
		{
			oldPassword: '',
			newPassword: ''
		}
	];
	return result;
};

export default useChangePasswordValidation;
