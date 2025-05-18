import ClientFooter from '@/app/components/ClientFooter';
import ServerHeaderData from '@/app/components/ServerHeader';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import Header from '@/layouts/lithium/lithium-header';
import dynamic from 'next/dynamic';

const CartModal = dynamic(() => import('@/app/components/cartModal/CartModal'), { 
  ssr: false 
});
export default async function DefaultLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const headerData = await ServerHeaderData(lang);

  return (
    <>
      <Header lang={lang!} logoUrl={headerData.logoUrl}
        shopName={headerData.shopName}
        background={headerData.backgroundUrl} />
      <ScrollToTop />

      <div className="relative">
        <CartModal lang={lang} />

        {children}
      </div>

      <ClientFooter lang={lang}  
        shopId={headerData.shopId}
      />
    </>
  );
}
