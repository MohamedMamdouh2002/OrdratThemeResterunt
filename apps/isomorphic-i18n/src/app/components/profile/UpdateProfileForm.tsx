'use client';
import { API_BASE_URL } from '@/config/base-url';
import Phone from '../ui/inputs/phone';
import Text from '../ui/inputs/Text';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/UserContext';
import { useTranslation } from '@/app/i18n/client';
import axiosClient from '../fetch/api';

type UserData = {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
};

const getUserDataFromLocalStorage = (): UserData => {
	const userDataString = localStorage.getItem('userData');
	return userDataString
		? JSON.parse(userDataString)
		: {
				firstName: '',
				lastName: '',
				email: '',
				phoneNumber: '',
		  };
};

type Props = {};

function UpdateProfileForm({lang}:{lang:string}) {
	const [userData, setUserData] = useState<UserData>(getUserDataFromLocalStorage);
	const { profileUserName ,setProfileUserName } = useUserContext();
	const { t } = useTranslation(lang!, 'profile');

	const router = useRouter();
	useEffect(() => {
		const username = `${userData.firstName} ${userData.lastName}`
		if (username != profileUserName && username) {
			setProfileUserName(username);
		}
	}, [userData]);
	const validationSchema = yup.object({
		// phoneNumber: yup
		// 	.string()
		// 	.required('Phone number is required')
		// 	.test('validate phone number', 'Invalid phone number', value => {
		// 		if (value && value !== '') return isValidPhoneNumber(value);
		// 		return false;
		// 	}),
	});

	const initialValues = {
		firstName: userData.firstName || '',
		lastName: userData.lastName || '',
		email: userData.email || '',
		phoneNumber: userData.phoneNumber || '',
	};

	const updateUserProfile = async (values: any) => {
		// try {
		// 	const token = localStorage.getItem('accessToken');

		// 	const response = await fetch(`${API_BASE_URL}/api/User/UpdateUser`, {
		// 		method: 'PUT',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 		body: JSON.stringify(values),
		// 	});
		// 	const result = await response.json();

		// 	if (result.message === 'Access token is invalid') {
		// 		localStorage.removeItem('Token');
		// 		localStorage.removeItem('accessToken');
		// 		localStorage.removeItem('phoneNumber');
		// 		toast.error('Access token is invalid, redirecting to home...');
		// 		router.push('/');
		// 		return;
		// 	}

		// 	if (!response.ok) {
		// 		throw new Error('Failed to update user');
		// 	}
						
		// 	const updatedUserData = {
		// 		phoneNumber: result.updateduser.phoneNumber,
		// 		firstName: result.updateduser.firstName,
		// 		lastName: result.updateduser.lastName,
		// 		email: result.updateduser.email,
		// 	};
			
		// 	localStorage.setItem('userData', JSON.stringify(updatedUserData));
		// 	setUserData(updatedUserData);
		// 	toast.success('User profile updated successfully!');			
		// } catch (error) {
		// 	if (error instanceof Error) {
		// 		toast.error(error.message || 'Error updating profile. Please try again.');
		// 	} else {
		// 		toast.error('An unknown error occurred. Please try again.');
		// 	}
		// }
		try {
			const token = localStorage.getItem('accessToken');

			const response = await axiosClient.put('/api/User/UpdateUser', values);

			const result = response.data;

			// Check for invalid token
			if (result.message === 'Access token is invalid') {
				localStorage.removeItem('Token');
				localStorage.removeItem('accessToken');
				localStorage.removeItem('phoneNumber');
				toast.error('Access token is invalid, redirecting to home...');
				router.push('/');
				return;
			}

			// Extract updated user data
			const updatedUserData = {
			phoneNumber: result.updateduser.phoneNumber,
			firstName: result.updateduser.firstName,
			lastName: result.updateduser.lastName,
			email: result.updateduser.email,
			};

			// Save to localStorage and update state
			localStorage.setItem('userData', JSON.stringify(updatedUserData));
			setUserData(updatedUserData);
			toast.success('User profile updated successfully!');
		} catch (error: any) {
			console.error('Error updating profile:', error);
			toast.error(error.response?.data?.message || 'Error updating profile. Please try again.');
		}
	};
	return (
		<Formik<any>
			initialValues={initialValues}
			enableReinitialize
			validationSchema={validationSchema}
			onSubmit={async (vals, { setSubmitting }) => {
				console.log('Submitted values: ', vals);
				await updateUserProfile({
					firstName: vals.firstName,
					lastName: vals.lastName,
					email: vals.email,
				});
				setSubmitting(false);
			}}
		>
			{({ errors, values, initialValues }) => {
				return (
					<Form className="grid md:grid-cols-2 grid-cols-1 gap-2">
						<Text name="firstName" label={t('fName')} placeholder={t('fName')} />
						<Text name="lastName" label={t('lName')} placeholder={t('lName')} />
						<Text name="email" label={t('email')} placeholder={t('email')} />
						<Phone  disabled={true}  name="phoneNumber" label={t('phone')} placeholder={t('phone')} />
						{/* <span className="mobile:hidden"></span> */}
						<button
							disabled={
								values.firstName === initialValues.firstName &&
								values.lastName === initialValues.lastName &&
								values.email === initialValues.email &&
								values.phoneNumber === initialValues.phoneNumber
							}
							className="mt-2 md:mt-5 md:col-span-1 col-span-full w-40 mx-auto md:mx-0 md:ms-auto px-8 py-2 text-slate-50 border border-transparent hover:border-mainColor bg-mainColor hover:text-mainColor hover:bg-transparent transition duration-150 rounded-lg disabled:bg-black/50 disabled:text-white disabled:border-none"
							type="reset"
						>
							{t('reset')}
						</button>
						<button
							disabled={
								(values.firstName === initialValues.firstName &&
									values.lastName === initialValues.lastName &&
									values.email === initialValues.email &&
									values.phoneNumber === initialValues.phoneNumber) ||
								errors.phoneNumber != undefined ||
								errors.firstName != undefined ||
								errors.email !== undefined ||
								errors.lastName != undefined
							}
							className="mt-2 md:mt-5 md:col-span-1 col-span-full w-40 mx-auto md:mx-0 px-8 py-2 border border-transparent hover:border-mainColor text-slate-50 bg-mainColor hover:text-mainColor hover:bg-transparent transition duration-150 rounded-lg disabled:bg-black/50 disabled:text-white disabled:border-none"
							type="submit"
						>
							{t('Save')}
						</button>
					</Form>
				);
			}}
		</Formik>
	);
}

export default UpdateProfileForm;
