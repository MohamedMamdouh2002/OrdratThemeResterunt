'use client';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import AddressItem from './AddressItem';
import { Loader2, Plus } from 'lucide-react';
import AddressModal from './AddressModal';
import NotFound from '../ui/NotFound';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';
import { useTranslation } from '@/app/i18n/client';
import axiosClient from '../fetch/api';

type Address = {
  id: string;
  aptNo: string;
  lat: number;
  lng: number;
  phoneNumber: string;
  street: string;
  type: number;
  floor?: number;
  additionalDirections?: string;
};

type Props = {};

function Addresses({lang}:{lang:string}) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<any>();
	const { updateAddresses, setUpdateAddresses } = useUserContext();
	const { t } = useTranslation(lang!, 'profile');
	console.log("selectedAddress: ",selectedAddress);
	
	const fetchAddresses = async () => {
		setIsLoading(true);
		try {
		  const response = await axiosClient.get('/api/Address/GetEndUserAddresses', {
			headers: {
			  'Content-Type': 'application/json',
			  'Accept-Language': lang,
			},
		  });
		  const data = response.data;
		  const phoneNumber = localStorage.getItem('phoneNumber');
		  const mappedAddresses = data.map((a: any) => ({
			id: a.id,
			aptNo: a.apartmentNumber,
			lat: a.latitude,
			lng: a.longtude,
			phoneNumber: phoneNumber,
			street: a.street,
			type: a.buildingType,
			floor: a.floor,
			additionalDirections: a.additionalDirections,
		}));
		
		setAddresses(mappedAddresses);
		setIsLoading(false);
	} catch (error) {
		console.error('Error fetching addresses:', error);
		  setIsLoading(false);
		} 
	};
	
	useEffect(() => {
	fetchAddresses();
	if (updateAddresses === true) {
		fetchAddresses();

		setUpdateAddresses(false);
	}
	}, [updateAddresses]);

	const handleAddNewAddress = () => {
		const phoneNumber = localStorage.getItem('phoneNumber');
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setSelectedAddress({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					phoneNumber: phoneNumber,
				});
				setIsOpen(true);
			},
			(error) => {
				console.error('Error fetching user location:', error);
				setSelectedAddress({
					lat: 30.023173855111207,
					lng: 31.185028997638923,
					phoneNumber: phoneNumber,
				});
				setIsOpen(true);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			}
		);
		
	};

	return (
		<>
			<div className="w-full grid xs:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-5 lg:px-8">
				<AnimatePresence mode="wait">
					{addresses.length > 0 ? (
						addresses.map((address, i) => (
						<AddressItem
							lang={lang}
							key={address.id}
							address={address}
							i={i}
							setIsOpen={setIsOpen}
							setSelectedAddress={setSelectedAddress}
						/>
						))
					) : isLoading ? (
						<span className="w-full flex flex-col items-center justify-center gap-3 dark:text-stone-400 text-lighterText">
							{t('loading')}
							<Loader2 className="text-mainColor  animate-spin" />
						</span>
					) : (
						!isLoading && <NotFound name={t('not-found')} />
					)}
				</AnimatePresence>
				<button
					onClick={handleAddNewAddress}
					className="self-center col-span-full w-40 mx-auto large:self-start flex gap-1 items-center px-3 py-2 rounded-lg text-white border border-transparent hover:border-mainColor bg-mainColor hover:bg-transparent hover:text-mainColor  transition duation-150"
				>
					<Plus />
					{t('New-Address')}
				</button>
			</div>
			<AnimatePresence mode="wait">
				{isOpen && <AddressModal lang={lang} isOpen={isOpen} setIsOpen={setIsOpen} address={selectedAddress} />}
			</AnimatePresence>
		</>
	);
}

export default Addresses;
