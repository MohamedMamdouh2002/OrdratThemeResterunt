import RefundPolicy from '@/app/components/refundPolicy/RefundPolicy';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'سياسة الاسترداد | استرجاع الأموال بكل سهولة' : 'Refund Policy | Easy Money-Back Guarantee',
      lang,
      undefined,
      lang === 'ar' ? 'اكتشف سياسة الاسترداد لدينا، شروط إرجاع المنتجات، والمدة الزمنية لمعالجة طلبات الاسترداد بسهولة.' : 'Learn about our refund policy, product return conditions, and the processing time for refunds with ease.',
    ),
  };
}
export default function Refund({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <RefundPolicy lang={lang}/>
}
