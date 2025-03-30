'use client';
import React, { useContext, useEffect, useState } from 'react';
import Logo from '@public/assets/karam-el-sham.png';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
// import Phone from '../../common/inputs/phone';
import Text from '../ui/Text/index';
import { loginInitialValues, useLoginValidation } from '../forms/LoginSchema';
import handleSubmit from '../fetch/handleSubmit';
import { Loader, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Input } from 'rizzui';
import * as yup from 'yup';

// import { shopId } from '@/config/shopId';
import { API_BASE_URL } from '@/config/base-url';
import { method } from 'lodash';
import { useUserContext } from '../context/UserContext';
import Phone from '../ui/inputs/phone';
// import { isValidPhoneNumber } from 'react-phone-number-input';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useTranslation } from '@/app/i18n/client';
import toast from 'react-hot-toast';
import { PhoneNumber } from '@ui/phone-input';

type Props = {

	onLogin?: () => void;
	setCurrentModal: (val: 'login' | 'register' | 'resetPassword') => void;
};

function Login({ onLogin, setCurrentModal }: Props, { lang }: { lang?: string }) {
	const { t,i18n } = useTranslation(lang!, 'nav');

	const { accessToken, setAccessToken, token, setToken, shopId } = useUserContext()
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
      setDescription(description)
    }
  }, [lang, i18n]);
	// const { setSession } = useContext(SessionContext);
	// const loginSchema = useLoginValidation({});
	// const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
	// const [errorMsg, setErrorMsg] = useState(false);
	// const [data, setData] = useState(null);
	// useEffect(() => {
	// 	if (data) {
	// 		setCookie('karam-el-sham-qr-session', data);
	// 		// setSession(data);
	// 		router.refresh();
	// 		onLogin?.();
	// 	}
	// }, [data]);
	// const [accountVerified, setAccountVerified] = useState(false);
	// useEffect(() => {
	// 	if (accountCreated && accountVerified) {
	// 		setCookie('karam-el-sham-qr-session', 'value');
	// 		router.refresh();
	// 	}
	// }, [accountCreated, accountVerified]);
	// console.log(errorMsg);
	async function sendData(values: any) {
		// jsonData = JSON.stringify(values);
		setLoading(true)
		const jsonData={
			phoneNumber:values.phoneNumber,
			shopId:values.shopId
		}
		let res = await fetch(`${API_BASE_URL}/api/Auth/EndUserLogin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(jsonData),
		});
		if(res.ok){
			const result = await res.json();
			toast.success(`${t('welcome-to-Karam-Elsham')} ${shopName}`)
			setLoading(false)
			console.log("resault: ", result);
			
			if (result?.refreshToken) {
	
				localStorage.setItem('accessToken', result?.accessToken);
				setAccessToken(result.accessToken)
				localStorage.setItem('Token', result?.refreshToken);
				localStorage.setItem('phoneNumber', result?.phoneNumber);
				// console.log("result?.refreshToken",result?.refreshToken);
				setToken(result.refreshToken)
				onLogin?.();
				const userData = {
					phoneNumber: result.phoneNumber,
					firstName: result.firstName || '',
					lastName: result.lastName || '',
					email: result.email || '',
				};
				localStorage.setItem('userData', JSON.stringify(userData));
			} else {
				console.log('Access Token not found.');
				setLoading(false)
		
			}
		}else{
			toast.error(`${t('welcome-to-Karam-Elsham')} ${shopName}`)
			setLoading(false)


		}
	}
	const phoneRegex = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)?[0-9]{7,8}$/;

	const validationSchema = yup.object({
		phoneNumber: yup
			.string()
			.required(t('Phonenumberisrequired'))
	});
	// const initialValues = {
	// 	phoneNumber:'',
	// 	shopId:shopId,
	// };

	let formik = useFormik({
		initialValues: {
			phoneNumber: '',
			shopId: shopId
		},
		validationSchema,
		onSubmit: sendData
	})
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col items-center justify-center">
				{/* <Image width={60} height={60} src={Logo} alt="logo" /> */}
				{logoUrl ? (
					<Image
						src={logoUrl} width={60} height={60} alt="logo" />
					) : (
					<div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
                )}
				<p className="text-sm font-light truncate-text">{description}</p>
			</div>
				<form onSubmit={formik.handleSubmit}>
					<div className=" flex justify-between w-full">
						<PhoneNumber
							label={t('phone')}
							country="eg"
							size='lg'
							className="mt-1 font-medium w-full"
							preferredCountries={['eg']}
							value={formik.values.phoneNumber}
							onChange={(value) => formik.setFieldValue('phoneNumber', value)}
							onBlur={formik.handleBlur}
							error={formik.touched.phoneNumber as any && formik.errors.phoneNumber ? formik.errors.phoneNumber as any : '' as any}
						/>
					</div>
				
					<div className=" flex items-center justify-center">

					<button
						type="submit"
						className="bg-mainColor py-3 px-6 rounded-xl mt-4 font-bold text-base text-white"
						disabled={loading}
						>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							t("sidebar-menu-sign-in")
						)}
					</button>
						</div>
				</form>
		</div>
	);
}

export default Login;
