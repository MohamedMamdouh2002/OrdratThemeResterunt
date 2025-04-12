'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import CustomImage from '../ui/CustomImage';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';
import { useTranslation } from '@/app/i18n/client';

type Props = {
  lang: string;
};

function FooterContent({ lang}: Props) {
    const { t } =  useTranslation(lang, 'nav');
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [contact, setContact] = useState<any>({
    facebookLink: '',
    instagramLink: '',
    whatsAppNumber: '',
    xLink: '',
  });
  const [shopName, setShopName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const { shopId } = useUserContext();

  useEffect(() => {
    setIsClient(true);
    setToken(localStorage.getItem('accessToken'));
    setLogoUrl(localStorage.getItem('logoUrl'));
    setShopName(localStorage.getItem('subdomainName'));
    setDescription(localStorage.getItem('description'));
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ShopContactInfo/GetByShopId/${shopId}`, {
          headers: { 'Accept-Language': lang },
        });
        if (res.ok) {
          const data = await res.json();
          setContact(data);
        }
      } catch (err) {
        console.error('Contact fetch failed', err);
      }
    };
    fetchContact();
  }, [shopId, lang]);

  const Links = [
    { link: faWhatsapp, href: contact.whatsAppNumber },
    { link: faXTwitter, href: contact.xLink },
    { link: faFacebookF, href: contact.facebookLink },
    { link: faInstagram, href: contact.instagramLink },
  ];

  const AccountBeforeLogin = [
    {
      header: t('Account'),
      menu: [{ title: t('login'), href: `/${lang}/login` }],
    },
    {
      header: t('quickLinks'),
      menu: [
        { title: t('cart'), href: `/${lang}/cart` },
        { title: t('search'), href: `/${lang}/search` },
        { title: t('review'), href: `/${lang}/reviews` },
        { title: t('faq'), href: `/${lang}/faq` },
      ],
    },
  ];

  const AccountAfterLogin = [
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
      ],
    },
  ];

  const linksToShow = token ? AccountAfterLogin : AccountBeforeLogin;

  return (
    <div className="w-[90%] mx-auto grid md:grid-cols-2 lg:grid-cols-6 py-4 gap-6">
      {/* Logo */}
      <div className="col-span-2">
        {logoUrl && (
          <CustomImage src={logoUrl} width={100} height={100} className="max-w-[60px]" alt="logo" />
        )}
        <h3>{shopName}</h3>
        <p className="text-sm">{description}</p>
        <h4 className="mt-4">{t('Get-in-Touch')}</h4>
        <div className="flex gap-2 mt-2">
          {Links.filter((i) => i.href).map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full text-mainColor"
            >
              <FontAwesomeIcon icon={item.link} />
            </a>
          ))}
        </div>
      </div>

      {/* Links */}
      {isClient &&
        linksToShow.map((section, idx) => (
          <div key={idx}>
            <h3 className="font-bold">{section.header}</h3>
            <div className="flex flex-col gap-2">
              {section.menu.map((item, i) => (
                <Link key={i} href={item.href || '#'}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default FooterContent;
