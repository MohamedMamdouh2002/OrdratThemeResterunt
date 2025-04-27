import CartModal from '@/app/components/cartModal/CartModal';
import ClientFooter from '@/app/components/ClientFooter';
import ServerHeaderData from '@/app/components/ServerHeader';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import Header from '@/layouts/lithium/lithium-header';

export default async function DefaultLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
    const headerData = await ServerHeaderData();
  
  return (
    <>
      <Header lang={lang!}  logoUrl={headerData.logoUrl}
      shopName={headerData.shopName}
      background={headerData.backgroundUrl} />     
      <ScrollToTop />
      
      <div className="relative">
      <CartModal lang={lang} />

        {children}
      </div>
      
      <ClientFooter lang={lang} />
    </>
  );
}
