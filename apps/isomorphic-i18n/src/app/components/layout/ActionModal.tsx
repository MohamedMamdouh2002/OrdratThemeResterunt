'use client';
import {
	Description,
	Dialog,
	DialogDescription,
	DialogPanel,
	DialogTitle
} from '@headlessui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircleIcon, XCircleIcon } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	title: string;
	lang: string;
	description: string;
	action: () => void;
	deleteAction?: boolean;
};

function ActionModal({
	isOpen,
	setIsOpen,
	title,
	description,
	action,
	lang,
	deleteAction = true
}: Props) {
	const { t } = useTranslation(lang!, 'profile');

	return (
		<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[999]">
			<div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />
			<motion.div
				initial={{ y: 25, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 25, opacity: 0 }}
				className="fixed inset-0 flex w-screen items-center justify-center p-4"
			>
				<DialogPanel className="bg-stone-100 border rounded-lg p-4">
					<DialogTitle
						className={`text-xl font-bold text-heaader pb-4 border-b font-header flex items-center gap-3`}
					>
						<AlertCircleIcon className="text-mainColor mt-1" />
						{title}
					</DialogTitle>
					<Description>
						<p className="mt-4 text-sm font-bold text-black/50 ">{description}</p>
					</Description>
					<div className="flex justify-end w-full items-center gap-3 mt-4">
						<button
							onClick={() => setIsOpen(false)}
							className="flex gap-1 items-center px-4 py-2 bg-zinc-500 text-white font-bold text-sm rounded-lg transition duration-150 hover:bg-zinc-600"
						>
							{t('cancel')}
						</button>
						<button
							onClick={() => {
								action();
								setIsOpen(false);
							}}
							className={`flex gap-1 items-center px-3 py-2 text-white font-bold text-sm rounded-lg transition duration-150${
								deleteAction
									? ' bg-red-500 hover:bg-red-600 '
									: ' bg-Color90 hover:bg-mainColor '
							}`}
						>
							{deleteAction ? (
								<>
									{t('deleteId')}
									<XCircleIcon size={18} />
								</>
							) : (
								<>
									{t('ok')}
								</>
							)}
						</button>
					</div>
				</DialogPanel>
			</motion.div>
		</Dialog>
	);
}

export default ActionModal;
