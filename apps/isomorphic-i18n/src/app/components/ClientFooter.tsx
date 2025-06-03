'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
import Footer from './footer/Footer';

function ClientFooter({lang,shopId}:{lang:string;shopId:string}) {
        const pathname = usePathname();
    
  return <>
      {(pathname !== '/' && pathname !== '/ar' && pathname !== '/en') && <Footer shopIdserver={shopId} lang={lang!} />}
  </>

}

export default ClientFooter