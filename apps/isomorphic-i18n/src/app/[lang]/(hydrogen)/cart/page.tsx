import CartBody from '@/app/components/cart/CartBody';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'سلة المشتريات | أكمل طلبك الآن' : 'Shopping Cart | Complete Your Order Now',
      lang,
      undefined,
      lang === 'ar' ? 'راجع منتجاتك المضافة إلى السلة، قم بتحديث الكميات، وأكمل عملية الشراء بسهولة.' : 'Review your added items, update quantities, and complete your purchase effortlessly.',
    ),
  };
}

export default function Cart({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <CartBody lang={lang}/>;
}
