'use client';
import { BadgeCent, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@public/assets/karam-el-sham.png';
import Link from 'next/link';
import Title from '@/app/components/ui/title/Title';
import { Order } from '@/types';
// import { photos } from '../fetch/api'; // يمكنك إعداد الصور هنا إذا لزم الأمر
import axiosClient from '../fetch/api'; 
import { EmptyProductBoxIcon } from 'rizzui';
import { useTranslation } from '@/app/i18n/client';
import fetchClient from '../fetch/api';

const MyOrder: React.FC<{ lang: string }> = ({ lang }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null); 
  const { t } = useTranslation(lang, 'order');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/Order/GetAllUserOrders`, {
          headers: {
            'Accept-Language': lang,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const storedLogo = localStorage.getItem("logoUrl");
    const storedName = localStorage.getItem("subdomainName");
    if (storedLogo) {
        setLogoUrl(storedLogo);
        setShopName(storedName);
    }
  }, [lang]);

  return (
    <>
      <Title title={t('Orders')} className="text-center text-[#404040]  mt-20" />
      {loading ? (
        <div className="flex justify-center ">
          <Loader className="animate-spin text-mainColor " />
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div>
              <div className="w-5/6 mx-auto mb-10">
                {orders.map((order) => (
                  <Link key={order.id} href={`/${lang}/orders/${order.id}`}>
                    <div className="relative bg-slate-100 hover:bg-orange-50 transition-all duration-100 px-4 py-4 border rounded-lg mb-4">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <h2 className="text-mainColor text-sm sm:text-base">{t('order-id')}</h2>
                          <h2 className="text-mainColor text-sm sm:text-base">{order.id}</h2>
                        </div>
                        <h3 className="text-mainColor">${order.totalPrice}</h3>
                      </div>
                      <div className="py-5">
                        <div className="flex gap-1 mt-3">
                          <p>{t('order-date')}</p>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mt-3">
                          <p>{t('total-choice-prices')}</p>
                          <span>{order.totalChoicePrices}</span>
                        </div>
                        {order.items.map((i, index) => (
                          <React.Fragment key={index}>
                            <div className="flex gap-1 mt-3">
                              <p>{t('quantity')}</p>
                              <span>{i.quantity}</span>
                            </div>
                            <p>{t('items')}</p>
                            <div className="flex mt-3">
                              <div className="rounded-lg border w-24 h-[115px] border-dashed border-mainColor">
                                <Image width={300} height={150} className="w-full h-[75%] rounded-t-lg" src={i.product.imageUrl} alt={i.product.name} />
                                <span className="truncate-text mt-1 ms-1">
                                  {i.product.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-3">
                              <p>{t('item-price')}</p>
                              <span>{i.itemPrice}</span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                          <div className="flex w-fit items-center p-2 rounded-lg gap-2 border border-dashed border-mainColor">
                            <BadgeCent className="text-mainColor" />
                            <span className="text-xs font-light">{t('cash-on-delivery')}</span>
                          </div>
                        </div>
                        <div className="absolute end-3 bottom-4">
                          <Image width={60} height={60} src={Logo} alt="logo" />
                          {logoUrl ? (
                            <Image src={logoUrl} width={60} height={60} alt="logo" />
                            ) : (
                            <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-5/6 m-auto my-10">
              <div className="flex flex-col justify-center items-center">
                <EmptyProductBoxIcon />
                <p>{t('order-empty')}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MyOrder;
