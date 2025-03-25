'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Logo from '@public/assets/karam-el-sham.png';
import { useTranslation } from '@/app/i18n/client';
import { Hand, LogIn, LogOut, ReceiptText, ShoppingCart, User, Users } from 'lucide-react';
import Modal from '../ui/Modal';
import Login from '../authPopups/Login';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonCircleQuestion, faStar } from '@fortawesome/free-solid-svg-icons';

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	lang: string; // إضافة خاصية اللغة
};

export const SideNav = ({ isOpen, setIsOpen, lang }: Props) => {
	const [hasAccount, setHasAccount] = useState(false);
	const [currentModal, setCurrentModal] = useState<'login' | 'register' | 'resetPassword'>('login');
	const [loginModal, setLoginModal] = useState(false);
	const pathname = usePathname();
	const { t } = useTranslation(lang, 'nav');
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement>(null);
	const { token, setToken } = useUserContext();
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [shopName, setShopName] = useState<string | null>(null);

	useEffect(() => {
		const storedLogo = localStorage.getItem("logoUrl");
		const storedName = localStorage.getItem("subdomainName");
		if (storedLogo) {
			setLogoUrl(storedLogo);
			setShopName(storedName);
		}
	}, [lang]);

	const handleLog = () => {
		setIsOpen(false);
		localStorage.removeItem('Token');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('phoneNumber');
		localStorage.removeItem('userData');
		router.push('/');
	};

	const login = [
		{
			icon: <LogIn />,
			action: () => setLoginModal(true),
			title: t('login')
		},
		{ icon: <ShoppingCart />, href: `/${lang}/cart`, title: t('cart') },
		{ icon: <FontAwesomeIcon icon={faPersonCircleQuestion as any} className='text-2xl' />, href: `/${lang}/faq`, title: t('faq') },
		{ icon: <FontAwesomeIcon icon={faStar as any} className='text-xl' />, href: `/${lang}/reviews`, title: t('review') },
	];

	const links = [
		{ icon: <User />, href: `/${lang}/profile`, title: t('profile') },
		{ icon: <ReceiptText />, href: `/${lang}/orders`, title: t('orders') },
		{ icon: <ShoppingCart />, href: `/${lang}/cart`, title: t('cart') },
		{ icon: <FontAwesomeIcon icon={faPersonCircleQuestion as any} className='text-2xl' />, href: `/${lang}/faq`, title: t('faq') },
		{ icon: <FontAwesomeIcon icon={faStar as any} className='text-xl' />, href: `/${lang}/reviews`, title: t('review') },
		{ icon: <LogOut />, onClick: handleLog, title: t('logout') }
	];

	return (
		<>
			<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[9999] ">
				<div className="fixed inset-0 dark:bg-stone-950/30 bg-black/30 backdrop-blur-md" aria-hidden="true" />
				<motion.div
					initial={{ x: lang === 'ar' ? 0 : -25, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: lang === 'ar' ? 25 : -25, opacity: 0 }}
					className="fixed start-0 top-0 p-4 min-h-screen flex w-64 items-start justify-start bg-stone-100 border-start"
				>
					<Dialog.Panel className="w-full py-2 px-2">
						<div className="w-full flex flex-col gap-5">
							{/* <Image width={60} height={60} src={Logo} alt="logo" /> */}
							{logoUrl ? (
								<Image src={logoUrl} width={60} height={60} alt="logo" />
							) : (
								<div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
							)}
							{localStorage.getItem('Token') ? (
								<>
									<h2>{t('welcome-to')} {shopName}</h2>
									{links.map((link, i) => {
										const isActive = link.href === pathname;
										return link.href ? (
											<Link
												onClick={() => setIsOpen(false)}
												key={i}
												href={link.href}
												className={`navlink font-bold transition flex items-center px-3 gap-2 relative duration-150 py-2 hover:text-mainColor ${isActive ? 'text-mainColor' : 'text-black/50'
													}`}
												data-active={isActive}
											>
												{link.icon}
												<span className="capitalize">{link.title}</span>
											</Link>
										) : link.onClick ? (
											<button
												onClick={link.onClick}
												key={i}
												className={`navlink font-bold transition flex items-center px-3 gap-2 relative duration-150 py-2 hover:text-mainColor ${isActive ? 'text-mainColor' : 'text-black/50'
													}`}
												data-active={isActive}
											>
												{link.icon}
												<span className="capitalize">{link.title}</span>
											</button>
										) : (
											<></>
										);
									})}
								</>
							) : (
								<>
									<h2>{t('welcome-to')} {shopName}</h2>
									<h2 className='text-lg'>{t('login-now')}</h2>
									{login.map((link, i) => (
										link.action ? (
											<button
												key={i}
												onClick={link.action}
												className="navlink font-bold transition flex items-center px-3 gap-2 relative duration-150 py-2 hover:text-mainColor text-black/50 cursor-pointer"
											>
												{link.icon}
												<span className="capitalize">{link.title}</span>
											</button>
										) : (
											<Link
												key={i}
												onClick={() => setIsOpen(false)}
												href={link.href!}
												className="navlink font-bold transition flex items-center px-3 gap-2 relative duration-150 py-2 hover:text-mainColor text-black/50"
											>
												{link.icon}
												<span className="capitalize">{link.title}</span>
											</Link>
										)
									))}
								</>
							)}
						</div>
					</Dialog.Panel>
				</motion.div>
			</Dialog>
			<AnimatePresence mode="wait">
				{loginModal && (
					<Modal isOpen={loginModal} setIsOpen={setLoginModal}>
						{currentModal === 'login' ? (
							<Login
								setCurrentModal={setCurrentModal}
								onLogin={() => {
									setLoginModal(false);
									setIsOpen(false);
									setHasAccount(true);
								}}
							/>
						) : currentModal === 'register' ? (
							<></>
						) : (
							<></>
						)}
					</Modal>
				)}
			</AnimatePresence>
		</>
	);
};
