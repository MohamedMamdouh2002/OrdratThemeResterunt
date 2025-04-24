'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
import Footer from './footer/Footer';

function ClientFooter({lang}:{lang:string}) {
        const pathname = usePathname();
    
  return <>
      {(pathname !== '/' && pathname !== '/ar' && pathname !== '/en') && <Footer lang={lang!} />}
  </>

}

export default ClientFooter