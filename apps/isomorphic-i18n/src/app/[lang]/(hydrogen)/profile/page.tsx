// 'use client'
import Layout from '@/app/components/ui/hoc/layout';
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';
import Addresses from '@/app/components/profile/Addresses';
import UpdateProfileForm from '@/app/components/profile/UpdateProfileForm';
import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';
import { ProfileHeader } from '@/app/shared/account-settings/profile-settings';
import { metaObject } from '@/config/site.config';



export async function generateMetadata({ params }: { params: { lang: string } }) {
	const lang = params.lang; 
	return {
	  ...metaObject(
		lang === 'ar' ? 'حسابي | إدارة ملفك الشخصي بسهولة' : 'My Account | Manage Your Profile Easily',
		lang,
		undefined,
		lang === 'ar' ? 'قم بتحديث بيانات حسابك، تتبع طلباتك، وحفظ عناوينك المفضلة في مكان واحد بكل سهولة.' : 'Update your account details, track your orders, and save your favorite addresses in one place effortlessly.',
	),
	};
  }

const translations = {
  accountDetails: { en: 'Account Details', ar: 'معلوماتي' },
  myAddresses: { en: 'My addresses', ar: 'عناويني' },
  title: { en: 'Dear User', ar: 'عميلنا العزيز' },
};

export default function Profile({
	params: { lang },
}: {
	params: {
	  lang: string;
	};
}) {
	return (
		<>
			<SessionGuard>
				<div className='w-full mx-auto'>
					<ProfileHeader
						title={translations.title[lang=='en'?'en':'ar']}
						description="01227375904"
					/>
				</div>
				<div className='w-[95%] md:w-[85%]  mx-auto'>
						<Layout fullLayout="false" currentPage="Profile" locale={lang}>
							<div className="container flex flex-col gap-10 w-full my-5">
								<div className="flex flex-col gap-5">
									<div className="flex justify-between items-center">
										<h2 className="text-2xl md:text-3xl font-medium">{translations.accountDetails[lang=='en'?'en':'ar']}</h2>
									</div>
									<UpdateProfileForm lang={lang} />
								</div>
								<div className="flex flex-col gap-5">
									<div className="flex justify-between items-center">
										<h2 className="text-2xl md:text-3xl font-medium">{translations.myAddresses[lang=='en'?'en':'ar']}</h2>
								  </div>
								  <Addresses lang={lang} />
							    </div>
						  </div>
					  </Layout>
				</div>
			</SessionGuard>
		</>
	);
}
