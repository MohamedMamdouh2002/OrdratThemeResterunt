'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import NotFoundImg from '@public/assets/notFoundPage.svg';
import { metaObject } from '@/config/site.config';
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'البحث | اعثر على أفضل المنتجات والخدمات' : 'Search | Find the Best Products and Services',
      lang,
      undefined,
      lang === 'ar' ? 'استخدم البحث للعثور على المطاعم، المتاجر، والمنتجات التي تناسب احتياجاتك بسرعة وسهولة.' : 'Use the search feature to find restaurants, stores, and products that suit your needs quickly and easily.'
    ),
  };
}
export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  return (
    <div className="my-10 text-center">
      <Image src={NotFoundImg} alt="Not Found" className="mx-auto" />
      <p className="font-medium text-xl">
        {lang === "ar"
          ? "الصفحه غير موجوده برجاء العوده الي الصفحة الرئيسية"
          : "The page does not exist. Please return to the home page."}
      </p>
      <Link
        href={`/${lang}/`}
        className="flex justify-center items-center bg-black w-fit py-2 px-8 hover:bg-transparent hover:text-mainColor duration-200 hover:border-2 hover:border-mainColor gap-3 rounded-full cursor-pointer mx-auto text-white mt-3"
      >
        {lang === "ar" ? "الرئيسية" : "Home"}
      </Link>
    </div>
  );
}
