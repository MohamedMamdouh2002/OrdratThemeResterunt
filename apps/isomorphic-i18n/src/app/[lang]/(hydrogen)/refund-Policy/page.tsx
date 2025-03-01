import RefundPolicy from '@/app/components/refundPolicy/RefundPolicy';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Refund'),
};

export default function Refund({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <RefundPolicy lang={lang}/>
}
