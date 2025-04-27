'use client';

import { usePathname } from 'next/navigation';
import CartModal from '@/app/components/cartModal/CartModal';
import Footer from '@/app/components/footer/Footer';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import Header from '@/layouts/lithium/lithium-header';
import ServerHeaderData from '@/app/components/ServerHeader';

export default async function LithiumLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  const pathname = usePathname();
  const headerData = await ServerHeaderData();

  return (
    <main className="flex min-h-screen flex-grow">
      <div className="flex w-full flex-col ">
        <ScrollToTop />
        <Header lang={lang!}  logoUrl={headerData.logoUrl}
      shopName={headerData.shopName}
      background={headerData.backgroundUrl} />
        <div className="relative">
          <CartModal lang={lang} />
          {children}
        </div>
        {(pathname !== '/' && pathname !== '/ar' && pathname !== '/en') && <Footer lang={lang!} />}
        </div>
    </main>
  );
}
