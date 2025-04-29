import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CheckoutPageWrapper from '@/app/shared/ecommerce/checkout';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'الدفع | خطوات آمنة لإتمام الطلب' : 'Checkout | Secure Steps to Complete Your Order',
      lang,
      undefined,
      lang === 'ar' ? 'أكمل عملية الدفع بأمان وسهولة باستخدام خيارات الدفع المختلفة واستمتع بتجربة تسوق مريحة.' : 'Complete your payment securely with various payment options and enjoy a smooth shopping experience.',
    ),
  };
}


export default function CheckoutPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return (
    <>
      {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> */}
      <CheckoutPageWrapper lang={lang} />
    </>
  );
}
