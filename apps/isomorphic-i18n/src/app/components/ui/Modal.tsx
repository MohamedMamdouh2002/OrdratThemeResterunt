'use client';
import { useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { domAnimation, LazyMotion, m } from 'framer-motion';

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	children: React.ReactNode;
	className?: string;
	lang?: string;
};

function Modal({ isOpen, setIsOpen, children, className, lang = 'en' }: Props) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// تحديد قيمة x بناءً على اللغة
	const translateX = lang === 'ar' ? '50%' : '-50%';
	const directionClass = lang === 'ar' ? 'right-1/2' : 'left-1/2'; // تغيير الموضع بناءً على اللغة

	return (
		<LazyMotion features={domAnimation}>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-[99998] flex h-screen items-center justify-center"
			>
				<div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />
				<m.div
					initial={{
						scale: 0.8,
						x: translateX,
						y: '-50%',
						opacity: 0
					}}
					animate={{
						scale: 1,
						x: translateX,
						y: '-50%',
						opacity: 1
					}}
					exit={{
						scale: 0.8,
						x: translateX,
						y: '-50%',
						opacity: 0
					}}
					className={`fixed ${directionClass} top-1/2 -translate-y-1/2 p-4 h-auto flex w-5/6 lg:w-2/5 items-start justify-start bg-white rounded-lg`}
					ref={modalRef}
				>
					<Dialog.Panel className={'py-2 px-2 lg:px-5 w-full h-full flex flex-col gap-5'}>
						{children}
					</Dialog.Panel>
				</m.div>
			</Dialog>
		</LazyMotion>
	);
}

export default Modal;
