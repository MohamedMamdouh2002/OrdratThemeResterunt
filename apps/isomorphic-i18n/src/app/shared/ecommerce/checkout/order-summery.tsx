'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { routes } from '@/config/routes';
import usePrice from '@hooks/use-price';
import OrderProducts from './order-products';
import { Button, Title, Text } from 'rizzui';
import cn from '@utils/class-names';
import { toCurrency } from '@utils/to-currency';
import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from '@/app/i18n/client';
import { useEffect } from 'react';

export default function OrderSummery({
  isLoading,
  className,
  lang,
  isButtonDisabled,
}: {
  className?: string;
  isLoading?: boolean;
  lang?: string;
  isButtonDisabled?: boolean;
}) {
  const params = useParams();
  const { items, total, addItemToCart, removeItemFromCart, clearItemFromCart } =
    useCart();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  const { t, i18n } = useTranslation(lang!, 'order');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);
  return (
    <div
      className={cn(
        'sticky top-24 mt-8 @5xl:col-span-4 @5xl:mt-0 @6xl:col-span-3 2xl:top-28',
        className
      )}
    >
      <Title as="h4" className="font-semibold">
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
            items={items}
            className="mb-5 border-b border-muted pb-5"
            lang={lang}
          />
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Subtotal')}
            <Text as="span" className="font-medium text-gray-900">
              {/* {subtotal} */}
              {toCurrency(total, lang)}
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Vat')}
            <Text as="span" className="font-medium text-gray-900">
              {toCurrency(0, lang)}
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            {t('Shipping-Fees')}
            <Text as="span" className="font-medium text-gray-900">
              {toCurrency(0, lang)}
            </Text>
          </div>
          <div className="flex items-center justify-between border-t border-muted py-4 text-base font-bold text-gray-1000">
            {t('Total')}
            {/* <Text>{totalPrice}</Text> */}
            <Text>{toCurrency(total, lang)}</Text>
          </div>

          {items.length ? (
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isButtonDisabled}
              className={`mt-3 w-full text-base @md:h-12 ${isButtonDisabled? "bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-mainColor hover:bg-mainColorHover"}`}
            >
              {params?.id ? `${t('Update-Order')}` : `${t('Place-Order')}`}
            </Button>
          ) : (
            <Link href={`/${lang}`}>
              <Button
                as="span"
                className="mt-3 w-full text-base @md:h-12 bg-mainColor hover:bg-mainColorHover"
              >{lang ==='ar'? 'العودة إلى المتجر': 'Back to Store'}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
