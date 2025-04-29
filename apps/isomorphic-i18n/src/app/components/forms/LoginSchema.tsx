import * as yup from 'yup';
import { useTranslation } from '@/app/i18n/client';

const useLoginValidation = ({ lang }: { lang?: string }) => {
  const { t } = useTranslation(lang!, 'loginForm');

  const ContactValidation = yup.object({
    email: yup.string().email(t('emailInvalid')).required(t('emailRequired')),

  });

  return ContactValidation;
};

const initialValues = {
  phoneNumber: '',
  shopId: ''
};

export { useLoginValidation, initialValues as loginInitialValues };
