import CartBody from '@/app/components/cart/CartBody';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('cart'),
};

export default function Cart({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <CartBody lang={lang}/>;
}
