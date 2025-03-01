import Order from '@/app/components/order/MyOrder';
import { metaObject } from '@/config/site.config';
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';

export const metadata = {
  ...metaObject('orders'),
};

export default function Orders({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <SessionGuard><Order lang={lang}/></SessionGuard>;
}
