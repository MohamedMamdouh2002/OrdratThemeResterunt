import ClientFooter from '@/app/components/ClientFooter';
import Footer from '@/app/components/footer/Footer';
import Navbar from '@/app/components/navbar/Navbar';
import ServerHeaderData from '@/app/components/ServerHeader';
import ScrollToTop from '@/app/components/ui/ScrollToTop';
import Header from '@/layouts/lithium/lithium-header';
import LithiumLayout from '@/layouts/lithium/lithium-layout';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from "next/dynamic";

export default function DefaultLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
    const headerData = ServerHeaderData();
  
  return (
    <>
      <Header lang={lang!}  logoUrl={headerData.logoUrl}
      shopName={headerData.shopName}
      background={headerData.backgroundUrl} />      {/* <Navbar lang={lang} /> */}
      <ScrollToTop />
      
      <div className="relative">
        {children}
      </div>
      
      <ClientFooter lang={lang} />
    </>
  );
}
