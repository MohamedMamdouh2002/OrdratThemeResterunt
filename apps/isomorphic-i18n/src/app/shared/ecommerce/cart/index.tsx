'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { recentlyProducts, recommendationProducts } from '@/data/shop-products';
import CartProduct from '@/app/shared/ecommerce/cart/cart-product';
import { useCart } from '@/store/quick-cart/cart.context';
import usePrice from '@hooks/use-price';
import { Empty, EmptyProductBoxIcon, Title, Text, Input, Button } from 'rizzui';
import ProductCarousel from '@/app/shared/product-carousel';
import cardImage from '../../../../../public/assets/card.png'
import sandwitsh from '../../../../../public/assets/sandwitsh.jpg'
import SpecialNotes from '@/app/components/ui/SpecialNotes';
import { toCurrency } from '@utils/to-currency';
import { useUserContext } from '@/app/components/context/UserContext';
import { useTranslation } from '@/app/i18n/client';

type FormValues = {
  couponCode: string;
};

function CheckCoupon({lang}:{lang?:string}) {
  const [reset, setReset] = useState({});
  const { orderNote, setOrderNote, copone, setCopone } = useUserContext();
  const { t } = useTranslation(lang!, 'order');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("coupon: ",data.couponCode);
    setCopone(data.couponCode);
    setReset({ couponCode: copone });
  };
  console.log("copoc",copone);
  
  return (
    <Form<FormValues>
      // resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: { couponCode: '' },
      }}
      className="w-full"
    >
      {({ register, formState: { errors }, watch }) =>  {
        const couponCode = watch('couponCode');
        const isCouponEntered = couponCode !== copone;
        // this for if you want that the input Empty then you can't apply any coupon
        // const isCouponEntered = couponCode && couponCode !== copone;
        return (
        <>
          <div className="relative flex items-end">
            <Input
              type="text"
              placeholder={t('promo-placeholder-code')}

              inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
              className="w-full"
              label={<Text>{t('promo-code')}</Text>}
              {...register('couponCode')}
              error={errors.couponCode?.message}
            />
            <Button
              type="submit"

              className={`ms-3 ${isCouponEntered ? 'bg-mainColor hover:bg-mainColorHover dark:hover:bg-mainColor/90' : 'bg-muted/70'}`}
              disabled={!isCouponEntered}
            >
              {copone ? `${t('Edit')}` : `${t('Apply')}`}
              {/* Apply */}
            </Button>
          </div>
        </>
      )}}
    </Form>
  );
}

// remove item

// cart product card

// total cart balance calculation
function CartCalculations({fees, Tax ,lang}:{fees:number; Tax:number ,lang?:string}) {
  const { t } = useTranslation(lang!, 'order');

  const router = useRouter();
  const { total } = useCart();
  const totalWithFees = total + Tax + fees;
  // const { price: totalPrice } = usePrice({
  //   amount: totalWithFees,
  // });

  return (
    <div>
      <Title as="h2" className="border-b border-muted pb-4 text-lg font-medium">
        {t('Cart-Totals')}
      </Title>
      <div className="mt-6 grid grid-cols-1 gap-4 @md:gap-6">
        <div className="flex items-center justify-between">
          {t('Subtotal')}
          <span className="font-medium text-gray-1000">{toCurrency(total, lang)}</span>
        </div>
        <div className="flex items-center justify-between">
          {t('Vat')}
          <span className="font-medium text-gray-1000">{toCurrency(Tax, lang)}</span>
        </div>
        <div className="flex items-center justify-between">
          {t('Shipping-Fees')}
          <span className="font-medium text-gray-1000">{toCurrency(fees, lang)}</span>
        </div>
        <CheckCoupon lang={lang} />
        <div className="mt-3 flex items-center justify-between border-t border-muted py-4 font-semibold text-gray-1000">
          {t('Total')}
          <span className="font-medium text-gray-1000">{toCurrency(totalWithFees, lang)}</span>
        </div>
        {totalWithFees === 0 ? (
          <Button
            size="xl"
            rounded="pill"
            className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
            disabled
          >
            {t('Proceed-To-Checkout')}
          </Button>
        ) : (
          <Link href={`/${lang}/checkout`} passHref>
            <Button
              size="xl"
              rounded="pill"
              className="w-full bg-mainColor hover:bg-mainColorHover"
              onClick={() => router.push(routes.eCommerce.checkout)}
            >
              {t('Proceed-To-Checkout')}
            </Button>
          </Link>
        )}
        {/* <Button
          size="xl"
          variant="outline"
          rounded="pill"

          className="w-full dark:bg-gray-100 dark:active:bg-gray-100 hover:border-mainColor"
        >
          <Image
            src="https://isomorphic-furyroad.s3.amazonaws.com/public/payment/paypal.png"
            alt="paypal-icon"
            width={80}
            height={10}
            className="object-contain"
          />
        </Button> */}
      </div>
    </div>
  );
}

export default function CartPageWrapper({lang}:{lang?:string}) {
  const { t ,i18n} = useTranslation(lang!, 'order');

  // const items = [
  //   {
  //       "id": 1,
  //       "name": "Kebab Sandwich",
  //       "slug": "kebab-sandwich-2",
  //       "description": "yogurt salad m,Syrian Bread",
  //       "image": cardImage,
  //       "price": 142,
  //       "quantity": 1,
  //       "sizeFood": "small",
  //       "color": {
  //           "name": "Purple Heart",
  //           "code": "#5D30DD"
  //       },
  //       "itemTotal": 142
  //   },
  //   {
  //       "id": 2,
  //       "name": "sandwitsh",
  //       "slug": "sandwitsh-1",
  //       "description": "very very delicious sandwitsh",
  //       "image": sandwitsh,
  //       "price": 295,
  //       "quantity": 2,
  //       "sizeFood": "large",
  //       "color": {
  //           "name": "Alizarin Crimson",
  //           "code": "#D72222"
  //       },
  //       "itemTotal": 590
  //   },
  //   {
  //       "id": 3,
  //       "name": "Kebab Sandwich-2",
  //       "slug": "kebab-sandwich-2",
  //       "description": "yogurt salad m,Syrian Bread",
  //       "image": cardImage,
  //       "price": 142,
  //       "quantity": 1,
  //       "sizeFood": "small",
  //       "color": {
  //           "name": "Purple Heart",
  //           "code": "#5D30DD"
  //       },
  //       "itemTotal": 142
  //   },
  //   {
  //       "id": 4,
  //       "name": "sandwitsh-2",
  //       "slug": "sandwitsh-2",
  //       "description": "very very delicious sandwitsh",
  //       "image": sandwitsh,
  //       "price": 295,
  //       "quantity": 2,
  //       "sizeFood": "large",
  //       "color": {
  //           "name": "Alizarin Crimson",
  //           "code": "#D72222"
  //       },
  //       "itemTotal": 590
  //   },
  //   {
  //       "id": 5,
  //       "name": "Kebab Sandwich-3",
  //       "slug": "kebab-sandwich-3",
  //       "description": "yogurt salad m,Syrian Bread",
  //       "image": cardImage,
  //       "price": 142,
  //       "quantity": 1,
  //       "sizeFood": "small",
  //       "color": {
  //           "name": "Purple Heart",
  //           "code": "#5D30DD"
  //       },
  //       "itemTotal": 142
  //   },
  //   {
  //       "id": 6,
  //       "name": "sandwitsh-3",
  //       "slug": "sandwitsh-3",
  //       "description": "very very delicious sandwitsh",
  //       "image": sandwitsh,
  //       "price": 295,
  //       "quantity": 2,
  //       "sizeFood": "large",
  //       "color": {
  //           "name": "Alizarin Crimson",
  //           "code": "#D72222"
  //       },
  //       "itemTotal": 590
  //   },
  // ];

  const { items } = useCart();  
  console.log("items: ",items);
   
  const [notes, setNotes] = useState('');
  const { orderNote, setOrderNote} = useUserContext();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <div className="@container">
      <div className="mx-auto w-full max-w-[1536px] items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="@5xl:col-span-8 mt-12 @5xl:mt-0 @6xl:col-span-7">
          {items.length ? (
            items.map((item) => <CartProduct ifModal={false} key={item.id} product={item} lang={lang} />)
          ) : (
            <Empty
              image={<EmptyProductBoxIcon />}
              text={t('cart-empty')}
            />
          )}
        </div>
        <div className="sticky top-24 mt-10 @container @5xl:col-span-4 @5xl:mt-0 @5xl:px-4 @6xl:col-span-3 2xl:top-28">
          <div className="flex flex-col gap-3">
            <div>
              <Title as="h2" className="border-b border-muted pb-4 mb-6 text-lg font-medium">
                {t('Special-request')}
              </Title>
              <SpecialNotes
                lang={lang!}
                des=""
                className="py-0 col-span-full"
                notes={orderNote}
                setNotes={setOrderNote}
              />
            </div>
            <CartCalculations lang={lang!} fees={0} Tax={0} />
          </div>
        </div>
      </div>
{/* 

      <ProductCarousel
        title={'Recommendations'}
        data={recommendationProducts}
      />

      <ProductCarousel title={'Recently Viewed'} data={recentlyProducts} /> */}
    </div>
  );
}
