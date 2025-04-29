import { useTranslation } from '@/app/i18n/client';
import * as yup from 'yup';
const useResetPasswordValidation = ({ lang }: { lang?: string }) => {
	const { t } = useTranslation(lang!, 'loginForm');
	const ContactValidation = yup.object({
		newPassword: yup
			.string()
			.required(t('newPasswordRequired'))
			.matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$@%_&? "]).*/, {
				message: t('newPasswordInvalid')
			}),
		confirmNewPassword: yup
			.string()
			.required(t('confirmNewPasswordRequired'))
			.matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$@%_&? "]).*/, {
				message: t('confirmNewPasswordInvalid')
			})
			.test(
				'compare newPassword to confirmedNewPassword',
				t('confirmNewPasswordInvalid'),
				function (val) {
					return this.parent.newPassword === val;
				}
			),
		verificationCode: yup
			.string()
			.required(t('verificationCodeRequired'))
			.min(6, t('verificationCodeRequired'))
	});
	return ContactValidation;
};

const initialValues = {
	newPassword: '',
	confirmNewPassword: '',
	verificationCode:''
};

export { useResetPasswordValidation, initialValues as resetPasswordInitialValues };
