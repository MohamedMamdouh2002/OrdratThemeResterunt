'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import * as yup from 'yup';
import { useUserContext } from '../context/UserContext';
import { API_BASE_URL } from '@/config/base-url';
import { useTranslation } from '@/app/i18n/client';
import toast from 'react-hot-toast';
import { PhoneNumber } from '@ui/phone-input';
import CustomImage from '../ui/CustomImage';

type Props = {
  onLogin?: () => void;
  setCurrentModal: (val: 'login' | 'register' | 'resetPassword') => void;
};

type CountryType = {
  countryCode: string;
  dialCode: string;
  name?: string;
};

function Login({ onLogin, setCurrentModal }: Props, { lang }: { lang?: string }) {
  const { t, i18n } = useTranslation(lang!, 'nav');
  const { setAccessToken, setToken, shopId } = useUserContext();

  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
    const storedLogo = localStorage.getItem("logoUrl");
    const storedName = localStorage.getItem("subdomainName");
    const description = localStorage.getItem("description");
    if (storedLogo) {
      setLogoUrl(storedLogo);
      setShopName(storedName);
      setDescription(description);
    }
  }, [lang, i18n]);

  const validationSchema = yup.object({
    phoneNumber: yup
      .string()
      .required(t('Phonenumberisrequired'))
      .when('countryCode', {
        is: 'eg',
        then: (schema) =>
          schema.matches(
			/^(\+?20)?0?1[0125][0-9]{8}$/,
            t('error')
          ),
        otherwise: (schema) => schema,
      }),
    countryCode: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      countryCode: 'eg',
      shopId: shopId,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const jsonData = {
        phoneNumber: values.phoneNumber,
        shopId: values.shopId,
      };
      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/EndUserLogin/${values.shopId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        });

        if (res.ok) {
          const result = await res.json();
          toast.success(`${t('welcome-to-Karam-Elsham')} ${shopName}`);
          setLoading(false);

          if (result?.refreshToken) {
            localStorage.setItem('accessToken', result?.accessToken);
            localStorage.setItem('Token', result?.refreshToken);
            localStorage.setItem('phoneNumber', result?.phoneNumber);
            setAccessToken(result.accessToken);
            setToken(result.refreshToken);

            const userData = {
              phoneNumber: result.phoneNumber,
              firstName: result.firstName || '',
              lastName: result.lastName || '',
              email: result.email || '',
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            onLogin?.();
          } else {
            console.log('Access Token not found.');
            setLoading(false);
          }
        } else {
          toast.error('فشل في تسجيل الدخول');
          setLoading(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('حدث خطأ أثناء تسجيل الدخول');
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center">
        {logoUrl ? (
          <CustomImage src={logoUrl} width={60} height={60} alt="logo" />
        ) : (
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
        )}
        <p className="text-sm font-light truncate-text">{description}</p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-between w-full">
          <PhoneNumber
            label={t('phone')}
            country="eg"
            size="lg"
            className="mt-1 font-medium w-full"
            preferredCountries={['eg']}
            value={formik.values.phoneNumber}
            onChange={(value, country) => {
              formik.setFieldValue('phoneNumber', value);
              const typedCountry = country as CountryType;
              formik.setFieldValue('countryCode', typedCountry.countryCode);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : ''
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-mainColor py-3 px-6 rounded-xl mt-4 font-bold text-base text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : t('sidebar-menu-sign-in')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
