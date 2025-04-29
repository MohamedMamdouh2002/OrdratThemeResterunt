import Order from '@/app/components/order/MyOrder';
import { metaObject } from '@/config/site.config';
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'طلباتي | تتبع طلباتك بسهولة' : 'My Orders | Track Your Orders Easily',
      lang,
      undefined,
      lang === 'ar' ? 'تابع حالة طلباتك الحالية، تحقق من تفاصيل الطلب، وتتبع حالة التوصيل في أي وقت.' : 'Track your current orders, check order details, and monitor delivery status anytime.',
    ),
  };
}

export default function Orders({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <SessionGuard><Order lang={lang}/></SessionGuard>;
}
