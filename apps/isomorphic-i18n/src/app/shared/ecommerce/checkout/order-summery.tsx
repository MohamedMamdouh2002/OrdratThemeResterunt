'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { routes } from '@/config/routes';
import usePrice from '@hooks/use-price';
import OrderProducts from './order-products';
import { Button, Title, Text } from 'rizzui';
import cn from '@utils/class-names';
import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/fetch/api';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
import Image from 'next/image';

type Branchprops = {
  name: string;
  addressText: string;
  openAt: string;
  closedAt: string;
  deliveryCharge: number;
  minimumDeliveryCharge: number;
  deliveryPerKilo: number;
  isFixedDelivery: boolean;
  deliveryTime: string;
}
export default function OrderSummery({
  isLoading,
  className,
  lang,
  branchId,
  isButtonDisabled,
  onSummaryCalculated,
  fees
}: {
  className?: string;
  branchId?: string;
  isLoading?: boolean;
  lang?: string;
  fees: number;
  isButtonDisabled?: boolean;
  onSummaryCalculated?: (summary: {
    finalTotal: number;
    tax: number;
    delivery: number;
    discount: number;
  }) => void;
}) {
  const params = useParams();
  // const abbreviation = useCurrencyAbbreviation({ lang } as any);
  const currencyAbbreviation = localStorage.getItem('currencyAbbreviation')

  const [response, setResponse] = useState<Branchprops[]>([]);

  const { items, total, addItemToCart, removeItemFromCart, clearItemFromCart } =
    useCart();
  const { orderNote, shopId, setOrderNote, copone, setCopone, discountValue, discountType } = useUserContext();

  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  const { t, i18n } = useTranslation(lang!, 'order');


  const storedVat = typeof window !== "undefined" ? Number(localStorage.getItem("vat")) || 0 : 0;
  const storedVatType = typeof window !== "undefined" ? Number(localStorage.getItem("vatType")) || 0 : 0;
  const freeShppingTarget = typeof window !== "undefined" ? Number(localStorage.getItem("freeShppingTarget")) || 0 : 0;

  const rawTaxValue =
    storedVatType === 0
      ? (storedVat / 100) * total
      : storedVat;

  const taxValue = Math.round((rawTaxValue + Number.EPSILON) * 100) / 100;


  const isFreeShipping = total >= freeShppingTarget;
  const shippingFees = isFreeShipping ? 0 : Number(fees);

  const totalWithFees = total + taxValue + shippingFees;
  const discount =
    discountType === 0
      ? parseFloat(((Number(discountValue) / 100) * totalWithFees).toFixed(2))
      : Number(discountValue);


  const finalTotal = parseFloat(Math.max(totalWithFees - discount, 0).toFixed(2));
  // discountType === 0
  // ? (Number(discountValue) / 100) * totalWithFees 
  // : Number(discountValue);
  // const totalPricewithDiscount = totalWithFees-discount
  useEffect(() => {
    i18n.changeLanguage(lang);
    
  }, [lang, i18n]);
  useEffect(() => {
    localStorage.setItem('total',finalTotal as any)    
  }, []);

  // ببعت القيم الي فيها لل checkout عشان ابعتها في ال api
  useEffect(() => {
    if (onSummaryCalculated) {
      onSummaryCalculated({
        finalTotal: totalWithFees,
        tax: taxValue,
        delivery: fees,
        discount,
      });
    }
  }, [totalWithFees, taxValue, fees, discount]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // setLoading(true);
        const response = await axiosClient.get(`/api/Branch/GetByShopId/${shopId}`, {
          headers: {
            'Accept-Language': lang,
          },
        });
        setResponse(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrders();
  }, [lang]);
  return (
    <div
      className={cn(
        'sticky top-24 mt-8 mb-5 @5xl:col-span-4 @5xl:mt-0 @6xl:col-span-3 2xl:top-28',
        className
      )}
    >
      <Title as="h4" className="font-semibold my-2">
        {t('Your-Order')}
      </Title>
      <div className="rounded-lg border border-muted p-4 @xs:p-6 pt-0 @xs:pt-0 @5xl:rounded-none @5xl:border-none @5xl:px-0">
        <div className="flex justify-between rounded-tl-lg rounded-tr-lg border-b border-muted pb-4 @xs:pb-4">
          {/* Ordered items
          <Link href={`/${lang}/cart`}>
            <Button
              as="span"
              variant="text"
              className="h-auto w-auto p-0 text-primary underline hover:text-gray-1000"
            >
              Edit Cart
            </Button>
          </Link> */}
        </div>
        <div className="pt-4 @xl:pt-6">
          <OrderProducts
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
            clearItemFromCart={clearItemFromCart}
            currencyAbbreviation={currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation as any}
            items={items}
            className="mb-5 border-b border-muted pb-5"
            lang={lang}
          />
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Subtotal')}
            <Text as="span" className="font-medium text-gray-900 flex items-center gap-1">
              {/* {subtotal} */}
              {/* {abbreviation&&toCurrency(total, lang as any,abbreviation)} */}
              {total}{" "}{currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Vat')}
            <Text as="span" className="font-medium text-gray-900 flex items-center gap-1">
              {taxValue}{" "}{currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}

              {/* {abbreviation&&toCurrency(taxValue, lang as any,abbreviation)} */}
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Shipping-Fees')}
            {/* <Text as="span" className="font-medium text-gray-900">
              {abbreviation&&toCurrency(fees, lang)}
            </Text> */}
            {(() => {
              const mainBranch = response.find(
                (i) => i.name
              );
              if (mainBranch?.isFixedDelivery) {
                return <span className='flex items-center gap-1'>
                      {shippingFees.toFixed(2)} {currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}

                  {/* {parseFloat(mainBranch?.deliveryCharge?.toString() || '0').toFixed(2)}    {currencyAbbreviation} */}
                  </span>;
              }
              else {
                return <span className='flex items-center gap-1' style={{ textDecoration: isFreeShipping ? 'line-through' : 'none' }}>
                  {/* {abbreviation&&toCurrency(fees, lang as any,abbreviation)} */}
                  {parseFloat(fees?.toString() || '0').toFixed(2)}{" "}{currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}
                </span>;
              }
            })()}


          </div>
          {discount > 0 && (
            <div className="flex mb-4 items-center justify-between text-green-600">
              {t('Discount')}
              <span className='flex items-center gap-1'>-{discount}{" "}{currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}
                {/* {abbreviation&&toCurrency(discount, lang as any,abbreviation)} */}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-muted py-4 text-base font-bold text-gray-1000">
            {t('Total')}
            {/* <Text>{totalPrice}</Text> */}
            <Text className='flex items-center gap-1'>
              {finalTotal}{" "}{currencyAbbreviation==='ر.س'? <Image src={sarIcon} alt="SAR" width={5} height={5}   style={{ width: '1rem', height: '1rem' }} /> :currencyAbbreviation}
              {/* {abbreviation&&toCurrency(finalTotal, lang as any,abbreviation)}
            */}
            </Text>
          </div>

          {items.length ? (
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isButtonDisabled}
              className={`mt-3 w-full text-base @md:h-12 ${isButtonDisabled ? "bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-mainColor hover:bg-mainColorHover"}`}
            >
              {params?.id ? `${t('Update-Order')}` : `${t('Place-Order')}`}
            </Button>
          ) : (
            <Link href={`/${lang}`}>
              <Button
                as="span"
                className="mt-3 w-full text-base @md:h-12 bg-mainColor hover:bg-mainColorHover"
              >{lang === 'ar' ? 'العودة إلى المتجر' : 'Back to Store'}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
