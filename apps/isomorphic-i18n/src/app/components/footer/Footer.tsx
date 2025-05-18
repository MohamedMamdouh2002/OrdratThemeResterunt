'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import logo from '@public/assets/karam-el-sham.png';
import Image from 'next/image';
import { useTranslation } from '@/app/i18n/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Login from '../authPopups/Login';
import { AnimatePresence } from 'framer-motion';
import Modal from '../ui/Modal';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';
import CustomImage from '../ui/CustomImage';
import { useIsMounted } from '@hooks/use-is-mounted';

type linksProps = {
  header: string;
  menu: {
    title: string;
    icon?: any;
    action?: any;
    href?: string;
  }[];
};

type mediaProps = {
  link: any;
  color: string;
  href: string;
};

type Props = {

  lang: string; 
};
function Footer({ lang }: Props) {
  const { t, i18n } = useTranslation(lang!, 'nav');
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [hasAccount, setHasAccount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<'login' | 'register' | 'resetPassword'>('login');
  const [loginModal, setLoginModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // const [contact, setContact] = useState<any>({
  //   facebookLink: "",
  //   instagramLink: "",
  //   whatsAppNumber: "",
  //   xLink: ""
  // });
  const { shopId } = useUserContext();
  const [shopName, setShopName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [contact, setContact] = useState({
    facebookLink: '',
    instagramLink: '',
    whatsAppNumber: '',
    xLink: '',
  });
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ShopContactInfo/GetByShopId/${shopId}`, {
          headers: { 'Accept-Language': lang },
        });
        if (!response.ok) throw new Error('Failed to fetch contact');
        const data = await response.json();
        setContact(data);
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };

    fetchContact();
  }, [lang, shopId]);

  // ✅ 2. prepare media links
  const Links: mediaProps[] = useMemo(() => {
    const linksArray: (mediaProps | null)[] = [
      contact.whatsAppNumber
        ? {
            link: faWhatsapp,
            color: '#1B8755',
            href: `https://wa.me/${contact.whatsAppNumber.replace(/\D/g, '')}`,
          }
        : null,
      contact.xLink
        ? {
            link: faXTwitter,
            color: 'black',
            href: contact.xLink,
          }
        : null,
      contact.facebookLink
        ? {
            link: faFacebookF,
            color: '#0866FF',
            href: contact.facebookLink,
          }
        : null,
      contact.instagramLink
        ? {
            link: faInstagram,
            color: '#F400D1',
            href: contact.instagramLink,
          }
        : null,
    ];
  
    return linksArray.filter((item): item is mediaProps => item !== null);
  }, [contact]);
  

  const AccountBeforeLogin: linksProps[] = [
    {
      header: t('Account'),
      menu: [
        {
          title: t('login'),
          action: () => setLoginModal(true),
        },
      ],
    },
    {
      header: t('quickLinks'),
      menu: [
        { title: t('cart'), href: `/${lang}/cart` },
        { title: t('search'), href: `/${lang}/search` },
        { title: t('review'), href: `/${lang}/reviews` },
        { title: t('faq'), href: `/${lang}/faq` },
        { title: t('ordrat'), href: `https://ordrat.com/` },
      ],
    },
    {
      header: t('Policy'),
      menu: [
        { title: t('PrivacyPolicy'), href: `/${lang}/privacy-policy` },
        { title: t('refundPolicy'), href: `/${lang}/refund-Policy` },
      ],
    },
  ];

  const AccountAfterLogin: linksProps[] = [
    {
      header: t('Account'),
      menu: [
        { title: t('profile'), href: `/${lang}/profile` },
        { title: t('orders'), href: `/${lang}/orders` },
      ],
    },
    {
      header: t('quickLinks'),
      menu: [
        { title: t('cart'), href: `/${lang}/cart` },
        { title: t('search'), href: `/${lang}/search` },
        { title: t('review'), href: `/${lang}/reviews` },
        { title: t('faq'), href: `/${lang}/faq` },
        { title: t('ordrat'), href: `https://ordrat.com/` },
      ],
    },
    {
      header: t('Policy'),
      menu: [
        { title: t('PrivacyPolicy'), href: `/${lang}/privacy-policy` },
        { title: t('refundPolicy'), href: `/${lang}/refund-Policy` },
      ],
    },
  ];

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/api/ShopContactInfo/GetByShopId/${shopId}`, {
  //         headers: {
  //           'Accept-Language': lang!,
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       setContact(data)
  //       console.log('contact data', data);
  //       console.log("linksData");

  //     }
  //     catch {

  //     }
  //   }
  //   fetchProducts();

  // }, []);
  const { facebookLink, instagramLink, whatsAppNumber, xLink } = contact;

  useEffect(() => {
    i18n.changeLanguage(lang);
    const storedLogo = localStorage.getItem("logoUrl");
    const storedName = localStorage.getItem("subdomainName");
    const description = localStorage.getItem("description");
    if (storedLogo) {
      setLogoUrl(storedLogo);
      setShopName(storedName);
      setDescription(description)
    }
  }, [lang, i18n]);
  const isMounted = useIsMounted();
    if (!isMounted) {
      return null;
    }
  return (
    <>
      <div className="mt-auto bg-ColorLitleHover">
        <div className="mt-10 mb-0">
          <div className="w-[90%] mx-auto grid md:grid-cols-2 lg:grid-cols-6 py-4 gap-6">
            {/* Logo Section */}
            <div className="col-span-2 flex flex-col gap-2 me-10">
              <div className="w-fit flex items-center gap-4">
                {/* <Image src={logo} alt="logo" className="max-w-[60px]" /> */}
                {logoUrl ? (
                  <CustomImage
                    src={logoUrl}
                    width={100}
                    height={100}
                    className="max-w-[60px]"
                    alt="logo"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
                )}
                <h3>{shopName}</h3>
              </div>
              <p className="text-sm font-light">{description}</p>
              <h4 className="mt-10">{t('Get-in-Touch')}</h4>
              <div className="flex items-center gap-2">
  {Links.map((i, index) => (
    <Link
      key={index}
      href={i.href as any}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-full flex items-center justify-center text-mainColor p-2 size-10 hover:bg-white transition duration-150 cursor-pointer"
    >
      <FontAwesomeIcon icon={i.link as any} className="text-xl" />
    </Link>
  ))}
</div>

            </div>

            {/* Dynamic Account Links */}
            {(token ? AccountAfterLogin : AccountBeforeLogin).map((acc, index) => (
              <div key={index} className="">
                <h3 className="font-bold text-lg h-[60px] capitalize flex items-center">{acc.header}</h3>
                <div className="flex flex-col gap-2">
                  {acc.menu.map((i, idx) =>
                    i.action ? (
                      <button
                        key={idx}
                        onClick={i.action}
                        className="text-black/75 capitalize transition duration-150 hover:text-mainColor w-fit"
                      >
                        {i.title}
                      </button>
                    ) : (
                      <Link
                        key={idx}
                        href={i.href!}
                        className="text-black/75 capitalize transition duration-150 hover:text-mainColor w-fit"
                      >
                        {i.title}
                      </Link>
                      
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="">
              <h3 className="font-bold text-lg h-[60px] capitalize flex items-center">
                {t('contact')}
              </h3>
              <div className="flex flex-col gap-2">
                <ul className="space-y-3 text-TextColor">
                  {/* <li>{t('address')}</li> */}
                  <li className="hover:text-mainColor items-center duration-200 w-fit">
                    <Link className="flex gap-2 items-center" href={`tel:${whatsAppNumber}`}>
                      <span>{whatsAppNumber}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-t-black/25 py-2 flex items-center justify-center text-center gap-2 bg-white">
            <p className="text-sm w-[90%] font-medium text-[#003049]">
              {lang === "ar" ? (
                <>
                  © {new Date().getFullYear()} • تم برمجة وتصميم موقع {shopName} بواسطة{" "}
                  <a
                    href="https://ordrat.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Ordrat.com
                  </a> شركة أوردرات
                </>
              ) : (
                <>
                  © {new Date().getFullYear()} • {shopName} website was programmed and designed by{" "}
                  <a
                    href="https://ordrat.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Ordrat.com
                  </a> Ordrat™ Company
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Login Modal */}

      {loginModal &&
        <AnimatePresence mode="wait">
          {loginModal && (
            <Modal isOpen={loginModal} setIsOpen={setLoginModal}>
              {currentModal === 'login' ? (
                <Login
                  setCurrentModal={setCurrentModal}
                  onLogin={() => {
                    setLoginModal(false);
                    setIsOpen(false as any);
                    setHasAccount(true);
                  }}
                />
              ) : currentModal === 'register' ? (
                <></>
              ) : (
                <></>
              )}
            </Modal>
          )}
        </AnimatePresence>
      }
    </>
  );
}

export default Footer;
