'use client';

import { usePathname } from 'next/navigation';
import CartModal from '@/app/components/cartModal/CartModal';
import Footer from '@/app/components/footer/Footer';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import Header from '@/layouts/lithium/lithium-header';

export default function LithiumLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-grow">
      <div className="flex w-full flex-col ">
        <ScrollToTop />
        <Header lang={lang} />
        <div className="relative">
          <CartModal lang={lang} />
          {children}
        </div>

        {(pathname !== '/' && pathname !== '/ar' && pathname !== '/en') && <Footer lang={lang!} />}
        </div>
    </main>
  );
}
