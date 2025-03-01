import Order from '@/app/components/order/MyOrder';
import PrivacyPolicy from '@/app/components/privacypolicy/PrivacyPolicy';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('PrivacyPolicy'),
};

export default function Privacy({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <PrivacyPolicy lang={lang!}/>
}
