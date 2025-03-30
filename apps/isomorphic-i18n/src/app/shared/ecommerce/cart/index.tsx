'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import axiosClient from '@/app/components/fetch/api';
import toast from 'react-hot-toast';

type FormValues = {
  couponCode: string;
};


type CouponResponse = {
  id: string;
  code: string;
  discountType: number;
  discountValue: any;
  expireDate: string;
  isActive: boolean;
  usageLimit: number;
};

const fetchCoupon = async (shopId: string, code: string): Promise<{ success: boolean; data?: CouponResponse }> => {
  try {
    const res = await axiosClient.get(`/api/Coupon/CheckCouponByCode/${shopId}?couponCode=${code}`);
    console.log("Coupon API response:", res);

    if (res.status === 200 && res.data?.code) {
      return { success: true, data: res.data };
    }
    return { success: false };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { success: false };
  }
};


export function CheckCoupon({ lang }: { lang?: string }) {
  const { copone, setCopone, setDiscountValue, setDiscountType, shopId } = useUserContext();
  const { t } = useTranslation(lang!, "order");

  const form = useForm<FormValues>({ defaultValues: { couponCode: "" } });
  const couponCode = form.watch("couponCode");

  // 🧠 استخدم useRef لتخزين الكود اللي اتطبق
  const appliedCouponRef = useRef("");

  useEffect(() => {
    // لو المستخدم عدل أو مسح الكود بعد التطبيق
    if (
      appliedCouponRef.current &&
      couponCode !== appliedCouponRef.current
    ) {
      setCopone("");
      setDiscountValue(0);
      setDiscountType(0);
      appliedCouponRef.current = "";
    }
  }, [couponCode]);

  const onSubmit = async (data: FormValues) => {
    const result = await fetchCoupon(shopId, data.couponCode);

    if (result.success) {
      toast.success(lang==='ar'? 'تم تطبيق الخصم بنجاح':'Coupon-applied-successfully');
      setCopone(data.couponCode);
      setDiscountValue(result.data?.discountValue || 0);
      setDiscountType(result.data?.discountType as any);
      appliedCouponRef.current = data.couponCode; 
    } else {
      toast.error(lang==='ar'? 'كوبون غير صحيح':'Invalid-coupon');

      // toast.error(t("Invalid-coupon"));
      setCopone("");
      setDiscountValue(0);
      setDiscountType(0);
      appliedCouponRef.current = "";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <div className="relative flex items-end">
      <Input
  type="text"
  placeholder={t("promo-placeholder-code")}
  inputClassName="text-[16px] [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
  className="w-full input-placeholder"
  label={<Text>{t("promo-code")}</Text>}
  {...form.register("couponCode")}
/>

        <Button
          type="submit"
          className={`ms-3 ${
            couponCode ? "bg-mainColor text-white hover:bg-mainColorHover" : "bg-muted/70"
          }`}
          disabled={!couponCode || couponCode === appliedCouponRef.current}
        >
          {copone ? t("Edit") : t("Apply")}
        </Button>
      </div>
    </form>
  );
}

// remove item

// cart product card

// total cart balance calculation


type Branchprops = {
  name: string;
  addressText: string;
  openAt: string;
  closedAt: string;
  deliveryTime: string;
  deliveryCharge: number;

}
function CartCalculations({ fees, Tax, lang }: { fees: number; Tax: number, lang?: string }) {
  const { t } = useTranslation(lang!, 'order');

  const router = useRouter();
  const { total } = useCart();
  const { discountValue, discountType, shopId } = useUserContext();
  const [response, setResponse] = useState<Branchprops[]>([]);

  const storedVat = typeof window !== "undefined" ? Number(localStorage.getItem("vat")) || 0 : 0;
  const storedVatType = typeof window !== "undefined" ? Number(localStorage.getItem("vatType")) || 0 : 0;

  const taxValue = storedVatType === 0
    ? (storedVat / 100) * total
    : storedVat;


  const totalWithFees = total + taxValue ;

  const discount =
    discountType === 0
      ? (Number(discountValue) / 100) * totalWithFees
      : Number(discountValue);

  const finalTotal = Math.max(totalWithFees - discount, 0);

  // const { price: totalPrice } = usePrice({
  //   amount: totalWithFees,
  // });
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
          <span className="font-medium text-gray-1000">{toCurrency(taxValue, lang)}</span>
          {/* <span className="font-medium text-gray-1000">{toCurrency(Tax, lang)}</span> */}
        </div>
        {/* <div className="flex items-center justify-between w-full mb-2">
          <span className="text-sm text-gray-600">
            {t('Shipping-Fees')}
          </span>
          <span className="font-semibold text-gray-800">
            {toCurrency(
              response.find((i) => i.name === "Main Branch" || i.name === "الفرع الرئيسي")?.deliveryCharge ?? 5,
              lang
            )}
          </span>
        </div> */}

        {discount ?(
          <div className="flex items-center justify-between text-green-600">
            {t('Discount')}
            <span>- {toCurrency(discount, lang)}</span>
          </div>
        ):''}
        <CheckCoupon lang={lang} />
        <div className="mt-3 flex items-center justify-between border-t border-muted py-4 font-semibold text-gray-1000">
          {t('Total')}
          <span className="font-medium text-gray-1000">{toCurrency(finalTotal, lang)}</span>
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

export default function CartPageWrapper({ lang }: { lang?: string }) {
  const { t, i18n } = useTranslation(lang!, 'order');

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
  console.log("items: ", items);

  const [notes, setNotes] = useState('');
  const { orderNote, setOrderNote } = useUserContext();
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
