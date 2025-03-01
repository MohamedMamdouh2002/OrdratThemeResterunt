'use client';
import { Dialog, RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { BriefcaseBusiness, Building, Home, Loader2, PenBox, PlusCircle, XOctagon } from 'lucide-react';
import Text from '../ui/inputs/Text';
import Phone from '../ui/inputs/phone';
import LocationPicker from '../ui/inputs/map/LocationPicker';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import { useUserContext } from '../context/UserContext';
import { useTranslation } from '@/app/i18n/client';
import useAddressValidation from '../ui/forms/NewAddressSchema';
import { PhoneNumber } from '@ui/phone-input';
// import { shopId } from '@/config/shopId';
import { useState } from 'react';

export default function AddressModalWithLogin({
	isOpen,
	setIsOpen,
	address,
	lang
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
	address?: Partial<any>;
	lang?:string;
}) {
	const [schema, initialValues] = useAddressValidation();
	const { updateAddresses, setUpdateAddresses, branchZones, shopId } = useUserContext();
	const { t } = useTranslation(lang!, 'profile');
	const [loading, setLoading] = useState(false);
	// console.log("address: ",address);

	const initialLocation = {
		lat: address?.lat || 30.023173855111207,
		lng: address?.lng || 31.185028997638923,
	};
	
	const mergedInitialValues = {
		...initialValues,
		...address,
		type: address?.type ?? 0,
	};
	
	const addressTypes = [
		{
			name: t('apartment'),
			icon: Building,
			value: 0
		},
		{
			name: t('home'),
			icon: Home,
			value: 1
		},
		{
			name: t('office'),
			icon: BriefcaseBusiness,
			value: 2
		}
	];

	const sendData = async (values: any) => {
		try {
			const jsonData = {
				phoneNumber: values.phoneNumber,
				shopId: shopId
			};

			const res = await fetch(`${API_BASE_URL}/api/Auth/EndUserLogin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(jsonData),
			});

			if (res.ok) {
				const result = await res.json();
				toast.success(t('welcome-to-Karam-Elsham'));

				if (result?.refreshToken) {
					localStorage.setItem('accessToken', result?.accessToken);
					localStorage.setItem('Token', result?.refreshToken);
					localStorage.setItem('phoneNumber', result?.phoneNumber);
					localStorage.setItem('userData', JSON.stringify({
						phoneNumber: result.phoneNumber,
						firstName: result.firstName || '',
						lastName: result.lastName || '',
						email: result.email || '',
					}));

					return true;
				}
			} else {
				toast.error(t('authentication-failed'));
			}
		} catch (error) {
			console.error('Error in authentication:', error);
			toast.error(t('authentication-error'));
		}

		return false;
	};

	const addAddress = async (vals: any) => {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			toast.error('No token found, please log in again.');
			return;
		}
		console.log(vals);
		
		try {
			const response = await fetch(
				`${API_BASE_URL}/api/Address/CreateEndUserAddress`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						additionalDirections: vals.additionalDirections,
						apartmentNumber: vals.aptNo,
						floor: vals.floor,
						street: vals.street,
						latitude: vals.lat,
						longtude: vals.lng,
						buildingType: vals.type
					}),
				}
			);

			const result = await response.json();

			if (response.ok) {
				toast.success(result.message || 'Address created successfully!');
				setUpdateAddresses(true);
				setIsOpen(false);
			} else {
				toast.error(result.message || 'Failed to create the address');
			}
		} catch (error) {
			console.error('Error creating address:', error);
			toast.error('An error occurred while creating the address.');
		} 
	};

	const handleLocationSelect = (lat: number | undefined, lng: number | undefined, address: string, setFieldValue: any, validateForm: any) => {
		if (lat && lng) {
			setFieldValue('lat', lat);
			setFieldValue('lng', lng);
			setFieldValue('street', address);
	
			setTimeout(() => {
				validateForm();
			}, 10);
		} else {
			setFieldValue('lat', undefined);
			setFieldValue('lng', undefined);
			setFieldValue('street', '');
	
			setTimeout(() => {
				validateForm();
			}, 10);
		}
	};	

	return (
		<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[999]">
			<div
				className="fixed inset-0 bg-black/30 backdrop-blur-md w-screen pb-10 overflow-y-auto overflow-x-hidden p-4"
				aria-hidden="true"
			>
				<div className="flex min-h-full items-center justify-center">
					<motion.div
						initial={{ y: 25, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 25, opacity: 0 }}
						className="inset-0 flex w-screen items-center justify-center p-0 sm:p-4"
					>
						<Dialog.Panel className="bg-stone-100  border rounded-lg p-4 pe-1 md:pe-4 w-full sm:w-auto">
							<Dialog.Title
								className={`text-2xl font-bold text-heaader pb-4 border-b font-header flex items-center gap-3`}
							>
								{address?.id ? (
									<>
										<PenBox className="text-mainColor mt-1" />
										{t('edit-address')}
									</>
								) : (
									<>
										<PlusCircle className="text-mainColor  mt-1" />
										{t('new-address')}
									</>
								)}
							</Dialog.Title>
							<Formik<any>
								initialValues={mergedInitialValues}
								enableReinitialize
								validationSchema={schema}
								validateOnBlur={true}
								onSubmit={async (vals) => {
									console.log('vals: ', vals);
									// if (address?.id) {
									// 	await updateAddress(vals);
									// } else {
									// 	await addAddress(vals);
									// }
									setLoading(true);
									const isAuthenticated = await sendData(vals);
									if (isAuthenticated) {
										await addAddress(vals);
									}
									setLoading(false);
								}}
							>
								{({ errors, touched, values, setFieldValue, initialValues, isValid, validateForm, setFieldTouched ,handleBlur }) => {
									// console.log("isValid: ", isValid);
									// console.log("errors: ", errors);
									// console.log("values: ", values);
									// console.log("phone error 1: ", touched.phoneNumber && errors.phoneNumber," :",errors.phoneNumber);
									// console.log("phone error 2: ", errors.phoneNumber," :",errors.phoneNumber);
									// console.log("phone error 3: ", touched.phoneNumber," :",errors.phoneNumber);
									
									return (
										
										<Form className="flex flex-col mt-6">
											<div className="grid md:grid-cols-2 grid-cols-1 gap-4 max-h-[60vh] md:max-h-full overflow-y-auto scrollable">
												<div className="flex flex-col gap-4  me-1 md:me-0">
													{/* <MapPicker /> */} 
													{/* <LocationPicker
														onLocationChange={vals => {
															setFieldValue('lat', vals?.lat);
															setFieldValue('lng', vals?.lng);
														}}
														initialLocation={initialLocation}
													/> */}
													<LocationPicker 
														apiKey='AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA' 
														onLocationSelect={(lat, lng, address) => handleLocationSelect(lat, lng, address, setFieldValue, validateForm)}
														initLat={address?.lat || 30.023173855111207}
														initLng={address?.lng || 31.185028997638923}
														branchZones={branchZones}
														lang={lang!}
													/>
													<RadioGroup
													value={values['type']}
													onChange={(val) => setFieldValue('type', val)}
													className={'grid md:flex grid-cols-3 gap-1 sm:gap-2 col-span-full'}
													>
													{addressTypes.map((a, i) => (
														<RadioGroup.Option key={i} value={a.value} className="flex gap-3">
														{({ checked }) => (
															<span
															className={`px-1 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 w-full capitalize cursor-pointer rounded-lg transition duration-150 ${
																checked ? 'bg-mainColor text-white' : 'hover:bg-mainColor/20'
															}`}
															>
															<a.icon className='w-4 xs:w-auto'/>
															{a.name}
															</span>
														)}
														</RadioGroup.Option>
													))}
													</RadioGroup>
												</div>
												<div className="new-address grid sm:grid-cols-2 grid-cols-1 gap-x-3  me-1 md:me-0">
													<Text name="aptNo" label={t('apt-lable')} placeholder={t('apt-lable')} required={true} />
													<Text name="floor" label={t('floor-lable')} placeholder={t('floor-lable')} required={true}/>
													<Text name="street" label={t('street-lable')} placeholder={t('street-lable')} required={true} />
													{/* <Phone name="phoneNumber" label={t('phoneNumber-lable')} placeholder={t('phoneNumber-lable')} required={true} /> */}
													<div>
														<PhoneNumber
															label={t('phoneNumber-lable')}
															country="eg"
															size='lg'
															inputClassName="!h-[41.6px] w-full p-3 !ps-10 !bg-white rounded-lg outline-0 border !border-[rgb(227,227,227,1)] hover:!border-[rgb(227,227,227,1)] px-3 py-2 focus-within:!border-dotted focus-within:!border-mainColor  focus-within:!outline-none disabled:!text-stone-400 focus:!border-mainColor focus:!outline-none focus:!ring-2 focus:!ring-transparent focus:!ring-offset-0"
															dropdownClassName="!h-[150px]"
															labelClassName='mb-3 text-header capitalize font-bold text-sm pe-3 basis-auto w-max break-words pointer-events-none'
															preferredCountries={['eg']}
															value={values.phoneNumber}  
															onChange={(value) => setFieldValue('phoneNumber', value)}
															onBlur={(e) => {
																setFieldTouched('phoneNumber', true); // ✅ Mark field as touched
																handleBlur(e); // ✅ Call Formik's default blur handler
															}}
															// error={touched.phoneNumber && errors.phoneNumber ? String(errors.phoneNumber) : undefined}
														/>
														{touched.phoneNumber && errors.phoneNumber ? 
															<div
																className={
																	'basis-full text-xs mt-1.5 mb-2 self-start flex items-center gap-2 text-[#F24444] font-medium capitalize'
																}
															>
																<XOctagon size={16} className="mt-0" />
								
																{String(errors.phoneNumber) }
															</div>
															: undefined
														}
													</div>

													<div className="col-span-full">
														<Text
															name="additionalDirections"
															label={t('additionalDirections-lable')}
															placeholder={t('more-information')}
															IsTextarea={true}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-center mt-5 gap-5">
												<button
													className="px-8 py-2 text-slate-50 bg-mainColor border border-transparent hover:border-mainColor hover:text-mainColor hover:bg-transparent transition duration-150 rounded-lg disabled:bg-black/50 disabled:text-white disabled:border-none"
													type="reset"
													onClick={() => {
														setIsOpen(false);
													}}
												>
													{t('cancelAddressModal')}
												</button>
												<button
													disabled={!isValid || loading}
													className="px-8 py-2 text-slate-50 bg-mainColor border border-transparent hover:border-mainColor hover:text-mainColor hover:bg-transparent transition duration-150 rounded-lg disabled:bg-black/50 disabled:text-white disabled:border-none"
													type="submit"
												>
													{loading ? <Loader2 className="animate-spin" size={20} /> : t('save')}
												</button>
											</div>
										</Form>
									);
								}}
							</Formik>
						</Dialog.Panel>
					</motion.div>
				</div>
			</div>
		</Dialog>
	);
}
